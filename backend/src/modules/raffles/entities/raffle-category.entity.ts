import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Raffle } from './raffle.entity';

@Entity('raffle_categories')
export class RaffleCategory {
  @PrimaryGeneratedColumn('increment')
  category_id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  icon_url: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  // Relacionamentos
  @OneToMany(() => Raffle, raffle => raffle.category)
  raffles: Raffle[];
}