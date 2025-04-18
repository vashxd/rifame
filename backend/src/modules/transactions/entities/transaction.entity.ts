import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Raffle } from '../../raffles/entities/raffle.entity';
import { UserPaymentMethod } from '../../users/entities/user-payment-method.entity';
import { TransactionTicket } from './transaction-ticket.entity';
import { AffiliateReferral } from '../../affiliates/entities/affiliate-referral.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  transaction_id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  raffle_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  payment_method_id: number;

  @Column()
  payment_gateway: string; // stripe, mercado_pago, etc

  @Column({ nullable: true })
  payment_gateway_transaction_id: string;

  @Column({ default: 'pending' })
  status: string; // pending, completed, failed, refunded

  @Column()
  transaction_type: string; // ticket_purchase, deposit, withdrawal, refund, commission

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  completed_at: Date;

  // Relacionamentos
  @ManyToOne(() => User, user => user.transactions, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Raffle, raffle => raffle.transactions, { nullable: true })
  @JoinColumn({ name: 'raffle_id' })
  raffle: Raffle;

  @ManyToOne(() => UserPaymentMethod, { nullable: true })
  @JoinColumn({ name: 'payment_method_id' })
  payment_method: UserPaymentMethod;

  @OneToMany(() => TransactionTicket, transactionTicket => transactionTicket.transaction)
  transaction_tickets: TransactionTicket[];

  @OneToMany(() => AffiliateReferral, referral => referral.transaction)
  affiliate_referrals: AffiliateReferral[];
}