import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('system_settings')
export class SystemSetting {
  @PrimaryGeneratedColumn('increment')
  setting_id: number;

  @Column({ unique: true })
  setting_key: string;

  @Column()
  setting_value: string;

  @Column({ nullable: true, type: 'text' })
  setting_description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  updated_by: number;

  // Relacionamentos
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;
}