import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Transaction } from './transaction.entity';
import { RaffleTicket } from '../../raffles/entities/raffle-ticket.entity';

@Entity('transaction_tickets')
export class TransactionTicket {
  @PrimaryColumn()
  transaction_id: number;

  @PrimaryColumn()
  ticket_id: number;

  // Relacionamentos
  @ManyToOne(() => Transaction, transaction => transaction.transaction_tickets)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => RaffleTicket, ticket => ticket.transaction_tickets)
  @JoinColumn({ name: 'ticket_id' })
  ticket: RaffleTicket;
}