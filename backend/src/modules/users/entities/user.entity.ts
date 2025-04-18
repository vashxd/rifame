import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserPaymentMethod } from './user-payment-method.entity';
import { VerifiedDocument } from './verified-document.entity';
import { Raffle } from '../../raffles/entities/raffle.entity';
import { RaffleTicket } from '../../raffles/entities/raffle-ticket.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { Affiliate } from '../../affiliates/entities/affiliate.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  user_id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password_hash: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  profile_image_url: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: 'pending' })
  verification_status: string; // pending, verified, rejected

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  reputation_score: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  wallet_balance: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  last_login: Date;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  reset_token: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  reset_token_expires: Date;

  // Relacionamentos
  @OneToMany(() => UserPaymentMethod, paymentMethod => paymentMethod.user)
  payment_methods: UserPaymentMethod[];

  @OneToMany(() => VerifiedDocument, document => document.user)
  verified_documents: VerifiedDocument[];

  @OneToMany(() => Raffle, raffle => raffle.creator)
  created_raffles: Raffle[];

  @OneToMany(() => RaffleTicket, ticket => ticket.user)
  tickets: RaffleTicket[];

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => Rating, rating => rating.user)
  ratings_given: Rating[];

  @OneToMany(() => Rating, rating => rating.rated_user)
  ratings_received: Rating[];

  @OneToMany(() => Affiliate, affiliate => affiliate.user)
  affiliate: Affiliate;
}