import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('increment')
  notification_id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column()
  type: string; // system, raffle, payment, winner

  @Column({ nullable: true })
  related_entity_type: string; // raffle, transaction, draw

  @Column({ nullable: true })
  related_entity_id: number;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;

  // Relacionamentos
  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}