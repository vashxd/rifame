import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('verified_documents')
export class VerifiedDocument {
  @PrimaryGeneratedColumn('increment')
  document_id: number;

  @Column()
  user_id: number;

  @Column()
  document_type: string; // identity, address_proof, prize_proof

  @Column()
  document_url: string;

  @Column({ default: 'pending' })
  verification_status: string; // pending, verified, rejected

  @Column({ nullable: true, type: 'text' })
  verification_notes: string;

  @Column({ nullable: true })
  verified_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => User, user => user.verified_documents)
  @JoinColumn({ name: 'user_id' })
  user: User;
}