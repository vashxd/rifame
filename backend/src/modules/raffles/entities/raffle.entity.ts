import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RaffleCategory } from './raffle-category.entity';
import { RaffleImage } from './raffle-image.entity';
import { RaffleTicket } from './raffle-ticket.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Draw } from '../../draws/entities/draw.entity';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity('raffles')
export class Raffle {
  @PrimaryGeneratedColumn('increment')
  raffle_id: number;

  @Column()
  creator_id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  category_id: number;

  @Column({ type: 'text' })
  prize_description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prize_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  ticket_price: number;

  @Column()
  total_tickets: number;

  @Column({ default: 0 })
  tickets_sold: number;

  @Column({ default: 'draft' })
  status: string; // draft, pending_approval, active, completed, cancelled

  @Column({ default: 'pending' })
  approval_status: string; // pending, approved, rejected

  @Column({ nullable: true, type: 'text' })
  approval_notes: string;

  @Column({ nullable: true })
  draw_date: Date;

  @Column({ default: 'automatic' })
  draw_method: string; // automatic, manual, live

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  ended_at: Date;

  @Column({ default: false })
  is_featured: boolean;

  @Column({ default: false })
  is_charity: boolean;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2 })
  charity_percentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  minimum_sales_percentage: number; // porcentagem mínima para realizar o sorteio

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  caution_deposit_amount: number; // valor caução para garantia

  @Column({ default: true })
  has_auto_draw: boolean; // se o sorteio será automático ao atingir 100%

  // Relacionamentos
  @ManyToOne(() => User, user => user.created_raffles)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @ManyToOne(() => RaffleCategory, category => category.raffles)
  @JoinColumn({ name: 'category_id' })
  category: RaffleCategory;

  @OneToMany(() => RaffleImage, image => image.raffle)
  images: RaffleImage[];

  @OneToMany(() => RaffleTicket, ticket => ticket.raffle)
  tickets: RaffleTicket[];

  @OneToMany(() => Transaction, transaction => transaction.raffle)
  transactions: Transaction[];

  @OneToMany(() => Draw, draw => draw.raffle)
  draws: Draw[];

  @OneToMany(() => Rating, rating => rating.raffle)
  ratings: Rating[];
}