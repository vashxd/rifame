import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Raffle } from './raffle.entity';

@Entity('raffle_images')
export class RaffleImage {
  @PrimaryGeneratedColumn('increment')
  image_id: number;

  @Column()
  raffle_id: number;

  @Column()
  image_url: string;

  @Column({ default: false })
  is_primary: boolean;

  @Column({ default: 0 })
  display_order: number;

  @CreateDateColumn()
  created_at: Date;

  // Relacionamentos
  @ManyToOne(() => Raffle, raffle => raffle.images)
  @JoinColumn({ name: 'raffle_id' })
  raffle: Raffle;
}