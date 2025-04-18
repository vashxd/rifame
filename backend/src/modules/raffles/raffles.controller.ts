import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { RafflesService } from './raffles.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('raffles')
export class RafflesController {
  constructor(private readonly rafflesService: RafflesService) {}

  /**
   * Cria uma nova rifa
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRaffleDto: CreateRaffleDto, @Request() req) {
    // Adiciona o ID do usuário logado como criador da rifa
    return this.rafflesService.create(createRaffleDto, req.user.userId);
  }

  /**
   * Busca todas as rifas com filtros opcionais
   */
  @Get()
  findAll(@Query() query) {
    const { status, category, featured, limit, page } = query;
    return this.rafflesService.findAll({
      status,
      category,
      featured: featured === 'true',
      limit: limit ? parseInt(limit) : 10,
      page: page ? parseInt(page) : 1,
    });
  }

  /**
   * Busca uma rifa pelo ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rafflesService.findOne(+id);
  }

  /**
   * Atualiza uma rifa
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRaffleDto: UpdateRaffleDto, @Request() req) {
    return this.rafflesService.update(+id, updateRaffleDto, req.user.userId);
  }

  /**
   * Remove uma rifa
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.rafflesService.remove(+id, req.user.userId);
  }

  /**
   * Compra um ou mais números de uma rifa
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/buy')
  buyTickets(
    @Param('id') id: string,
    @Body() data: { ticketNumbers: number[], paymentMethodId: number },
    @Request() req,
  ) {
    if (!data.ticketNumbers || data.ticketNumbers.length === 0) {
      throw new BadRequestException('É necessário selecionar pelo menos um número');
    }

    return this.rafflesService.buyTickets(+id, data.ticketNumbers, req.user.userId, data.paymentMethodId);
  }

  /**
   * Aprova uma rifa (apenas para administradores)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/approve')
  approveRaffle(@Param('id') id: string, @Body() data: { notes?: string }, @Request() req) {
    // Verificação de admin deve ser feita no serviço
    return this.rafflesService.approveRaffle(+id, data.notes, req.user.userId);
  }

  /**
   * Rejeita uma rifa (apenas para administradores)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/reject')
  rejectRaffle(@Param('id') id: string, @Body() data: { notes: string }, @Request() req) {
    // Verificação de admin deve ser feita no serviço
    return this.rafflesService.rejectRaffle(+id, data.notes, req.user.userId);
  }

  /**
   * Destaca uma rifa na página inicial (apenas para administradores)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/feature')
  featureRaffle(@Param('id') id: string, @Request() req) {
    // Verificação de admin deve ser feita no serviço
    return this.rafflesService.featureRaffle(+id, req.user.userId);
  }
}