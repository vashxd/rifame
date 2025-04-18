import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_payment_methods')
export class UserPaymentMethod {
  @PrimaryGeneratedColumn('increment')
  payment_method_id: number;

  @Column()
  user_id: number;

  @Column()
  payment_type: string; // credit_card, debit_card, pix

  @Column()
  provider: string; // visa, mastercard, etc

  @Column()
  token_reference: string; // token armazenado no gateway de pagamento

  @Column({ nullable: true })
  last_four: string;

  @Column({ nullable: true })
  expiry_date: string;

  @Column({ default: false })
  is_default: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => User, user => user.payment_methods)
  @JoinColumn({ name: 'user_id' })
  user: User;
}