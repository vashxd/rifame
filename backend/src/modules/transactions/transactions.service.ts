import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionTicket } from './entities/transaction-ticket.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { RafflesService } from '../raffles/raffles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(TransactionTicket)
    private transactionTicketsRepository: Repository<TransactionTicket>,
    private dataSource: DataSource,
    private rafflesService: RafflesService,
    private usersService: UsersService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Criar a transação
      const transaction = this.transactionsRepository.create({
        user_id: createTransactionDto.user_id,
        raffle_id: createTransactionDto.raffle_id,
        amount: createTransactionDto.amount,
        payment_method_id: createTransactionDto.payment_method_id,
        payment_gateway: createTransactionDto.payment_gateway,
        payment_gateway_transaction_id: createTransactionDto.payment_gateway_transaction_id,
        transaction_type: createTransactionDto.transaction_type,
        status: 'pending',
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      // Se for compra de bilhetes, associar os bilhetes à transação
      if (createTransactionDto.transaction_type === 'ticket_purchase' && createTransactionDto.ticket_ids?.length > 0) {
        for (const ticketId of createTransactionDto.ticket_ids) {
          const transactionTicket = this.transactionTicketsRepository.create({
            transaction_id: savedTransaction.transaction_id,
            ticket_id: ticketId,
          });
          await queryRunner.manager.save(transactionTicket);
        }
      }

      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.transactionsRepository.find({
      relations: ['user', 'raffle', 'payment_method', 'transaction_tickets', 'transaction_tickets.ticket'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUserId(userId: number) {
    return this.transactionsRepository.find({
      where: { user_id: userId },
      relations: ['raffle', 'payment_method', 'transaction_tickets', 'transaction_tickets.ticket'],
      order: { created_at: 'DESC' },
    });
  }

  async findByRaffleId(raffleId: number) {
    return this.transactionsRepository.find({
      where: { raffle_id: raffleId },
      relations: ['user', 'payment_method', 'transaction_tickets', 'transaction_tickets.ticket'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, user: any) {
    const transaction = await this.transactionsRepository.findOne({
      where: { transaction_id: id },
      relations: ['user', 'raffle', 'payment_method', 'transaction_tickets', 'transaction_tickets.ticket'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Verificar se o usuário tem permissão para ver esta transação
    if (transaction.user_id !== user.user_id && !user.is_admin) {
      throw new ForbiddenException('You do not have permission to view this transaction');
    }

    return transaction;
  }

  async confirmPayment(id: number, user: any) {
    const transaction = await this.findOne(id, user);

    if (transaction.status !== 'pending') {
      throw new BadRequestException(`Transaction is already ${transaction.status}`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Atualizar status da transação
      transaction.status = 'completed';
      transaction.completed_at = new Date();
      await queryRunner.manager.save(transaction);

      // Se for compra de bilhetes, atualizar status dos bilhetes
      if (transaction.transaction_type === 'ticket_purchase') {
        const transactionTickets = await this.transactionTicketsRepository.find({
          where: { transaction_id: transaction.transaction_id },
          relations: ['ticket'],
        });

        for (const transactionTicket of transactionTickets) {
          const ticket = transactionTicket.ticket;
          ticket.status = 'sold';
          ticket.user_id = transaction.user_id;
          ticket.purchased_at = new Date();
          await queryRunner.manager.save(ticket);
        }

        // Atualizar contador de bilhetes vendidos na rifa
        if (transaction.raffle_id) {
          await this.rafflesService.updateTicketsSold(transaction.raffle_id, transactionTickets.length);
        }
      }

      // Se for depósito, adicionar valor à carteira do usuário
      if (transaction.transaction_type === 'deposit') {
        await this.usersService.updateWalletBalance(transaction.user_id, transaction.amount);
      }

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async refundPayment(id: number) {
    const transaction = await this.transactionsRepository.findOne({
      where: { transaction_id: id },
      relations: ['transaction_tickets', 'transaction_tickets.ticket'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    if (transaction.status !== 'completed') {
      throw new BadRequestException(`Cannot refund a transaction that is not completed`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Atualizar status da transação
      transaction.status = 'refunded';
      await queryRunner.manager.save(transaction);

      // Se for compra de bilhetes, liberar os bilhetes
      if (transaction.transaction_type === 'ticket_purchase') {
        for (const transactionTicket of transaction.transaction_tickets) {
          const ticket = transactionTicket.ticket;
          ticket.status = 'available';
          ticket.user_id = null;
          ticket.purchased_at = null;
          await queryRunner.manager.save(ticket);
        }

        // Atualizar contador de bilhetes vendidos na rifa
        if (transaction.raffle_id) {
          await this.rafflesService.updateTicketsSold(transaction.raffle_id, -transaction.transaction_tickets.length);
        }
      }

      // Se foi depósito, remover valor da carteira do usuário
      if (transaction.transaction_type === 'deposit') {
        await this.usersService.updateWalletBalance(transaction.user_id, -transaction.amount);
      }

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async processPaymentWebhook(webhookData: any) {
    // Implementar lógica para processar webhooks de pagamento
    // Isso dependerá do gateway de pagamento utilizado (Stripe, Mercado Pago, etc.)
    
    // Exemplo básico:
    if (webhookData.event === 'payment.success') {
      const transactionId = webhookData.transaction_id;
      const transaction = await this.transactionsRepository.findOne({
        where: { payment_gateway_transaction_id: webhookData.payment_id },
      });

      if (transaction) {
        // Simular usuário admin para confirmar pagamento
        const adminUser = { user_id: 0, is_admin: true };
        return this.confirmPayment(transaction.transaction_id, adminUser);
      }
    }

    return { received: true };
  }
}