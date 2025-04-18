import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Raffle } from './entities/raffle.entity';
import { RaffleImage } from './entities/raffle-image.entity';
import { RaffleTicket } from './entities/raffle-ticket.entity';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { UsersService } from '../users/users.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class RafflesService {
  constructor(
    @InjectRepository(Raffle)
    private readonly rafflesRepository: Repository<Raffle>,
    @InjectRepository(RaffleImage)
    private readonly raffleImagesRepository: Repository<RaffleImage>,
    @InjectRepository(RaffleTicket)
    private readonly raffleTicketsRepository: Repository<RaffleTicket>,
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Cria uma nova rifa
   */
  async create(createRaffleDto: CreateRaffleDto, creatorId: number): Promise<Raffle> {
    // Verifica se o usuário existe e está verificado
    const user = await this.usersService.findOne(creatorId);
    if (!user.is_verified) {
      throw new ForbiddenException('Apenas usuários verificados podem criar rifas');
    }

    // Inicia uma transação para garantir a consistência dos dados
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Cria a rifa
      const raffle = this.rafflesRepository.create({
        ...createRaffleDto,
        creator_id: creatorId,
        status: 'draft',
        approval_status: 'pending',
      });

      const savedRaffle = await queryRunner.manager.save(raffle);

      // Cria os tickets da rifa
      const tickets = [];
      for (let i = 1; i <= createRaffleDto.total_tickets; i++) {
        tickets.push({
          raffle_id: savedRaffle.raffle_id,
          ticket_number: i,
          status: 'available',
        });
      }

      // Salva os tickets em lotes para melhor performance
      const chunkSize = 1000;
      for (let i = 0; i < tickets.length; i += chunkSize) {
        const chunk = tickets.slice(i, i + chunkSize);
        await queryRunner.manager.insert(RaffleTicket, chunk);
      }

      // Salva as imagens da rifa, se houver
      if (createRaffleDto.images && createRaffleDto.images.length > 0) {
        const images = createRaffleDto.images.map(image => {
          return this.raffleImagesRepository.create({
            ...image,
            raffle_id: savedRaffle.raffle_id,
          });
        });

        await queryRunner.manager.save(images);
      }

      await queryRunner.commitTransaction();
      return savedRaffle;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Busca todas as rifas com filtros opcionais
   */
  async findAll(filters: {
    status?: string;
    category?: number;
    featured?: boolean;
    limit: number;
    page: number;
  }): Promise<{ items: Raffle[]; total: number; page: number; limit: number }> {
    const { status, category, featured, limit, page } = filters;

    const query = this.rafflesRepository.createQueryBuilder('raffle')
      .leftJoinAndSelect('raffle.images', 'images')
      .leftJoinAndSelect('raffle.category', 'category');

    // Aplica os filtros
    if (status) {
      query.andWhere('raffle.status = :status', { status });
    } else {
      // Por padrão, mostra apenas rifas ativas
      query.andWhere('raffle.status = :status', { status: 'active' });
    }

    if (category) {
      query.andWhere('raffle.category_id = :category', { category });
    }

    if (featured !== undefined) {
      query.andWhere('raffle.is_featured = :featured', { featured });
    }

    // Paginação
    const total = await query.getCount();
    query.skip((page - 1) * limit).take(limit);

    // Ordenação
    query.orderBy('raffle.created_at', 'DESC');

    const items = await query.getMany();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * Busca uma rifa pelo ID
   */
  async findOne(id: number): Promise<Raffle> {
    const raffle = await this.rafflesRepository.findOne({
      where: { raffle_id: id },
      relations: ['images', 'category', 'creator'],
    });

    if (!raffle) {
      throw new NotFoundException(`Rifa com ID ${id} não encontrada`);
    }

    return raffle;
  }

  /**
   * Atualiza uma rifa
   */
  async update(id: number, updateRaffleDto: UpdateRaffleDto, userId: number): Promise<Raffle> {
    const raffle = await this.findOne(id);

    // Verifica se o usuário é o criador da rifa
    if (raffle.creator_id !== userId) {
      throw new ForbiddenException('Apenas o criador pode atualizar a rifa');
    }

    // Verifica se a rifa pode ser atualizada
    if (raffle.status !== 'draft' && raffle.status !== 'pending_approval') {
      throw new BadRequestException('Apenas rifas em rascunho ou aguardando aprovação podem ser atualizadas');
    }

    // Atualiza a rifa
    const updatedRaffle = this.rafflesRepository.merge(raffle, updateRaffleDto);
    return this.rafflesRepository.save(updatedRaffle);
  }

  /**
   * Remove uma rifa
   */
  async remove(id: number, userId: number): Promise<void> {
    const raffle = await this.findOne(id);

    // Verifica se o usuário é o criador da rifa
    if (raffle.creator_id !== userId) {
      throw new ForbiddenException('Apenas o criador pode remover a rifa');
    }

    // Verifica se a rifa pode ser removida
    if (raffle.status !== 'draft' && raffle.status !== 'pending_approval') {
      throw new BadRequestException('Apenas rifas em rascunho ou aguardando aprovação podem ser removidas');
    }

    await this.rafflesRepository.remove(raffle);
  }

  /**
   * Compra um ou mais números de uma rifa
   */
  async buyTickets(
    raffleId: number,
    ticketNumbers: number[],
    userId: number,
    paymentMethodId: number,
  ): Promise<{ tickets: RaffleTicket[]; transaction: any }> {
    const raffle = await this.findOne(raffleId);

    // Verifica se a rifa está ativa
    if (raffle.status !== 'active') {
      throw new BadRequestException('Esta rifa não está disponível para compra');
    }

    // Verifica se os números estão disponíveis
    const tickets = await this.raffleTicketsRepository.find({
      where: {
        raffle_id: raffleId,
        ticket_number: { $in: ticketNumbers },
      },
    });

    if (tickets.length !== ticketNumbers.length) {
      throw new BadRequestException('Um ou mais números selecionados não estão disponíveis');
    }

    for (const ticket of tickets) {
      if (ticket.status !== 'available') {
        throw new BadRequestException(`O número ${ticket.ticket_number} não está disponível`);
      }
    }

    // Calcula o valor total da compra
    const totalAmount = raffle.ticket_price * ticketNumbers.length;

    // Inicia uma transação para garantir a consistência dos dados
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Cria a transação de pagamento
      const transaction = await this.transactionsService.createTicketPurchaseTransaction(
        userId,
        raffleId,
        totalAmount,
        paymentMethodId,
        tickets.map(ticket => ticket.ticket_id),
      );

      // Atualiza o status dos tickets
      for (const ticket of tickets) {
        ticket.status = 'sold';
        ticket.user_id = userId;
        ticket.transaction_id = transaction.transaction_id;
        ticket.purchased_at = new Date();
      }

      await queryRunner.manager.save(tickets);

      // Atualiza o contador de tickets vendidos da rifa
      raffle.tickets_sold += ticketNumbers.length;
      await queryRunner.manager.save(raffle);

      await queryRunner.commitTransaction();

      return { tickets, transaction };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Aprova uma rifa (apenas para administradores)
   */
  async approveRaffle(id: number, notes: string, adminId: number): Promise<Raffle> {
    // Verifica se o usuário é administrador
    const admin = await this.usersService.findOne(adminId);
    if (!admin.is_admin) {
      throw new ForbiddenException('Apenas administradores podem aprovar rifas');
    }

    const raffle = await this.findOne(id);

    // Verifica se a rifa está aguardando aprovação
    if (raffle.approval_status !== 'pending') {
      throw new BadRequestException('Esta rifa não está aguardando aprovação');
    }

    // Atualiza o status da rifa
    raffle.approval_status = 'approved';
    raffle.status = 'active';
    raffle.approval_notes = notes;

    return this.rafflesRepository.save(raffle);
  }

  /**
   * Rejeita uma rifa (apenas para administradores)
   */
  async rejectRaffle(id: number, notes: string, adminId: number): Promise<Raffle> {
    // Verifica se o usuário é administrador
    const admin = await this.usersService.findOne(adminId);
    if (!admin.is_admin) {
      throw new ForbiddenException('Apenas administradores podem rejeitar rifas');
    }

    const raffle = await this.findOne(id);

    // Verifica se a rifa está aguardando aprovação
    if (raffle.approval_status !== 'pending') {
      throw new BadRequestException('Esta rifa não está aguardando aprovação');
    }

    // Atualiza o status da rifa
    raffle.approval_status = 'rejected';
    raffle.approval_notes = notes;

    return this.rafflesRepository.save(raffle);
  }

  /**
   * Destaca uma rifa na página inicial (apenas para administradores)
   */
  async featureRaffle(id: number, adminId: number): Promise<Raffle> {
    // Verifica se o usuário é administrador
    const admin = await this.usersService.findOne(adminId);
    if (!admin.is_admin) {
      throw new ForbiddenException('Apenas administradores podem destacar rifas');
    }

    const raffle = await this.findOne(id);

    // Verifica se a rifa está ativa
    if (raffle.status !== 'active') {
      throw new BadRequestException('Apenas rifas ativas podem ser destacadas');
    }

    // Atualiza o status de destaque da rifa
    raffle.is_featured = !raffle.is_featured;

    return this.rafflesRepository.save(raffle);
  }
}