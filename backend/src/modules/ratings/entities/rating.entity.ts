import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Raffle } from '../../raffles/entities/raffle.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('increment')
  rating_id: number;

  @Column()
  user_id: number;

  @Column()
  rated_user_id: number;

  @Column({ nullable: true })
  raffle_id: number;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ nullable: true, type: 'text' })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => User, user => user.ratings_given)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, user => user.ratings_received)
  @JoinColumn({ name: 'rated_user_id' })
  rated_user: User;

  @ManyToOne(() => Raffle, raffle => raffle.ratings, { nullable: true })
  @JoinColumn({ name: 'raffle_id' })
  raffle: Raffle;
}