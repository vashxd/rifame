import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Affiliate } from './affiliate.entity';
import { User } from '../../users/entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('affiliate_referrals')
export class AffiliateReferral {
  @PrimaryGeneratedColumn('increment')
  referral_id: number;

  @Column()
  affiliate_id: number;

  @Column()
  referred_user_id: number;

  @Column({ nullable: true })
  transaction_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  commission_amount: number;

  @Column({ default: 'pending' })
  status: string; // pending, paid, cancelled

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  paid_at: Date;

  // Relacionamentos
  @ManyToOne(() => Affiliate, affiliate => affiliate.referrals)
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'referred_user_id' })
  referred_user: User;

  @ManyToOne(() => Transaction, transaction => transaction.affiliate_referrals, { nullable: true })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}