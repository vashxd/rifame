import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Raffle } from './raffle.entity';
import { User } from '../../users/entities/user.entity';
import { TransactionTicket } from '../../transactions/entities/transaction-ticket.entity';
import { Draw } from '../../draws/entities/draw.entity';

@Entity('raffle_tickets')
export class RaffleTicket {
  @PrimaryGeneratedColumn('increment')
  ticket_id: number;

  @Column()
  raffle_id: number;

  @Column()
  ticket_number: number;

  @Column({ default: 'available' })
  status: string; // available, reserved, sold

  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  transaction_id: number;

  @Column({ nullable: true })
  reservation_expires_at: Date;

  @Column({ nullable: true })
  purchased_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => Raffle, raffle => raffle.tickets)
  @JoinColumn({ name: 'raffle_id' })
  raffle: Raffle;

  @ManyToOne(() => User, user => user.tickets, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => TransactionTicket, transactionTicket => transactionTicket.ticket)
  transaction_tickets: TransactionTicket[];

  @OneToMany(() => Draw, draw => draw.winning_ticket)
  winning_draws: Draw[];
}