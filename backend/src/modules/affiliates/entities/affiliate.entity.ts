import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AffiliateReferral } from './affiliate-referral.entity';

@Entity('affiliates')
export class Affiliate {
  @PrimaryGeneratedColumn('increment')
  affiliate_id: number;

  @Column()
  user_id: number;

  @Column({ unique: true })
  affiliate_code: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.00 })
  commission_percentage: number;

  @Column({ default: 0 })
  total_referred_users: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  total_commission: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => User, user => user.affiliate)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => AffiliateReferral, referral => referral.affiliate)
  referrals: AffiliateReferral[];
}