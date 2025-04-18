import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Draw } from './entities/draw.entity';
import { CreateDrawDto } from './dto/create-draw.dto';
import { UpdateDrawDto } from './dto/update-draw.dto';
import { RafflesService } from '../raffles/raffles.service';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';

@Injectable()
export class DrawsService {
  constructor(
    @InjectRepository(Draw)
    private drawsRepository: Repository<Draw>,
    private rafflesService: RafflesService,
    private usersService: UsersService,
  ) {}

  async create(createDrawDto: CreateDrawDto) {
    // Verificar se a rifa existe
    const raffle = await this.rafflesService.findOne(createDrawDto.raffle_id);
    if (!raffle) {
      throw new NotFoundException(`Raffle with ID ${createDrawDto.raffle_id} not found`);
    }

    // Verificar se a rifa está ativa
    if (raffle.status !== 'active') {
      throw new BadRequestException(`Cannot schedule draw for raffle with status ${raffle.status}`);
    }

    // Criar o sorteio
    const draw = this.drawsRepository.create({
      ...createDrawDto,
      status: 'scheduled',
    });

    return this.drawsRepository.save(draw);
  }

  async findAll() {
    return this.drawsRepository.find({
      relations: ['raffle', 'winning_ticket', 'verifier'],
      order: { draw_date: 'DESC' },
    });
  }

  async findOne(id: number) {
    const draw = await this.drawsRepository.findOne({
      where: { draw_id: id },
      relations: ['raffle', 'winning_ticket', 'verifier'],
    });

    if (!draw) {
      throw new NotFoundException(`Draw with ID ${id} not found`);
    }

    return draw;
  }

  async findByRaffleId(raffleId: number) {
    return this.drawsRepository.find({
      where: { raffle_id: raffleId },
      relations: ['winning_ticket', 'verifier'],
      order: { draw_date: 'DESC' },
    });
  }

  async scheduleDrawForRaffle(raffleId: number, createDrawDto: CreateDrawDto, user: any) {
    // Verificar se a rifa existe e pertence ao usuário
    const raffle = await this.rafflesService.findOne(raffleId);
    if (!raffle) {
      throw new NotFoundException(`Raffle with ID ${raffleId} not found`);
    }

    if (raffle.creator_id !== user.user_id && !user.is_admin) {
      throw new ForbiddenException('You do not have permission to schedule a draw for this raffle');
    }

    // Verificar se a rifa está ativa
    if (raffle.status !== 'active') {
      throw new BadRequestException(`Cannot schedule draw for raffle with status ${raffle.status}`);
    }

    // Verificar se já existe um sorteio agendado
    const existingDraw = await this.drawsRepository.findOne({
      where: { raffle_id: raffleId, status: 'scheduled' },
    });

    if (existingDraw) {
      throw new BadRequestException(`A draw is already scheduled for this raffle`);
    }

    // Criar o sorteio
    const draw = this.drawsRepository.create({
      ...createDrawDto,
      raffle_id: raffleId,
      status: 'scheduled',
    });

    return this.drawsRepository.save(draw);
  }

  async executeDraw(id: number) {
    const draw = await this.findOne(id);

    if (draw.status !== 'scheduled') {
      throw new BadRequestException(`Draw is already ${draw.status}`);
    }

    // Verificar se a rifa tem bilhetes vendidos
    const raffle = await this.rafflesService.findOne(draw.raffle_id, ['tickets']);
    const soldTickets = raffle.tickets.filter(ticket => ticket.status === 'sold');

    if (soldTickets.length === 0) {
      throw new BadRequestException(`Raffle has no sold tickets`);
    }

    // Gerar semente aleatória se não foi fornecida
    if (!draw.draw_seed) {
      draw.draw_seed = crypto.randomBytes(16).toString('hex');
    }

    // Algoritmo de sorteio
    const randomIndex = this.getRandomIndex(soldTickets.length, draw.draw_seed);
    const winningTicket = soldTickets[randomIndex];

    // Atualizar o sorteio
    draw.winning_ticket_id = winningTicket.ticket_id;
    draw.status = 'completed';
    draw.completed_at = new Date();
    draw.draw_result_hash = this.generateResultHash(draw.draw_seed, winningTicket.ticket_id);

    const savedDraw = await this.drawsRepository.save(draw);

    // Atualizar status da rifa
    await this.rafflesService.updateRaffleStatus(raffle.raffle_id, 'completed');

    return savedDraw;
  }

  async verifyDraw(id: number, updateDrawDto: UpdateDrawDto, verifierId: number) {
    const draw = await this.findOne(id);

    if (draw.status !== 'completed') {
      throw new BadRequestException(`Cannot verify a draw that is not completed`);
    }

    // Atualizar informações de verificação
    draw.verified_by = verifierId;
    draw.verification_notes = updateDrawDto.verification_notes;

    return this.drawsRepository.save(draw);
  }

  // Método para gerar índice aleatório baseado na semente
  private getRandomIndex(max: number, seed: string): number {
    const hash = crypto.createHash('sha256').update(seed).digest('hex');
    const randomValue = parseInt(hash.substring(0, 8), 16);
    return randomValue % max;
  }

  // Método para gerar hash do resultado
  private generateResultHash(seed: string, ticketId: number): string {
    return crypto.createHash('sha256').update(`${seed}-${ticketId}`).digest('hex');
  }
}