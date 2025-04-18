import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Raffle } from '../../raffles/entities/raffle.entity';
import { RaffleTicket } from '../../raffles/entities/raffle-ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('draws')
export class Draw {
  @PrimaryGeneratedColumn('increment')
  draw_id: number;

  @Column()
  raffle_id: number;

  @Column({ nullable: true })
  winning_ticket_id: number;

  @Column()
  draw_date: Date;

  @Column()
  draw_method: string; // automatic, manual, live

  @Column({ nullable: true })
  draw_seed: string; // semente para verificação do algoritmo

  @Column({ nullable: true, type: 'text' })
  draw_algorithm: string; // descrição ou identificador do algoritmo usado

  @Column({ nullable: true })
  video_url: string; // URL do vídeo do sorteio ao vivo

  @Column({ default: 'scheduled' })
  status: string; // scheduled, completed, cancelled

  @Column({ nullable: true })
  draw_result_hash: string; // hash para garantir integridade do resultado

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  completed_at: Date;

  @Column({ nullable: true })
  verified_by: number; // admin que verificou

  @Column({ nullable: true, type: 'text' })
  verification_notes: string;

  // Relacionamentos
  @ManyToOne(() => Raffle, raffle => raffle.draws)
  @JoinColumn({ name: 'raffle_id' })
  raffle: Raffle;

  @ManyToOne(() => RaffleTicket, ticket => ticket.winning_draws, { nullable: true })
  @JoinColumn({ name: 'winning_ticket_id' })
  winning_ticket: RaffleTicket;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'verified_by' })
  verifier: User;
}