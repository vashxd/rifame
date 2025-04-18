import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CreateRaffleAnalyticsDto, UpdateRaffleAnalyticsDto, RaffleAnalyticsResponseDto } from './dto/raffle-analytics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('raffle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar analytics para uma rifa' })
  @ApiResponse({ status: 201, description: 'Analytics criado com sucesso', type: RaffleAnalyticsResponseDto })
  async create(@Body() createRaffleAnalyticsDto: CreateRaffleAnalyticsDto) {
    return this.analyticsService.create(createRaffleAnalyticsDto);
  }

  @Get('raffle/:id')
  @ApiOperation({ summary: 'Obter analytics de uma rifa específica' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiResponse({ status: 200, description: 'Analytics encontrado', type: RaffleAnalyticsResponseDto })
  @ApiResponse({ status: 404, description: 'Analytics não encontrado' })
  async findByRaffleId(@Param('id') id: string) {
    return this.analyticsService.findByRaffleId(+id);
  }

  @Patch('raffle/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar analytics de uma rifa' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiResponse({ status: 200, description: 'Analytics atualizado com sucesso', type: RaffleAnalyticsResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateRaffleAnalyticsDto: UpdateRaffleAnalyticsDto,
  ) {
    return this.analyticsService.update(+id, updateRaffleAnalyticsDto);
  }

  @Post('raffle/:id/view')
  @ApiOperation({ summary: 'Registrar uma visualização de rifa' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiQuery({ name: 'unique', required: false, description: 'Se é uma visualização única', type: Boolean })
  @ApiQuery({ name: 'source', required: false, description: 'Fonte da visualização' })
  @ApiQuery({ name: 'device_type', required: false, description: 'Tipo de dispositivo' })
  @ApiResponse({ status: 200, description: 'Visualização registrada com sucesso', type: RaffleAnalyticsResponseDto })
  async registerView(
    @Param('id') id: string,
    @Query('unique') isUnique?: boolean,
    @Query('source') source?: string,
    @Query('device_type') deviceType?: string,
  ) {
    return this.analyticsService.registerView(+id, isUnique === 'true', source, deviceType);
  }

  @Post('raffle/:id/conversion')
  @ApiOperation({ summary: 'Registrar uma conversão (compra ou abandono de carrinho)' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiQuery({ name: 'cart_abandoned', required: false, description: 'Se o carrinho foi abandonado', type: Boolean })
  @ApiResponse({ status: 200, description: 'Conversão registrada com sucesso', type: RaffleAnalyticsResponseDto })
  async registerConversion(
    @Param('id') id: string,
    @Query('cart_abandoned') isCartAbandoned?: string,
  ) {
    return this.analyticsService.registerConversion(+id, isCartAbandoned === 'true');
  }

  @Post('raffle/:id/behavior')
  @ApiOperation({ summary: 'Registrar comportamento do usuário' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiQuery({ name: 'time_on_page', required: true, description: 'Tempo na página em segundos', type: Number })
  @ApiQuery({ name: 'bounce', required: false, description: 'Se o usuário saiu sem interagir', type: Boolean })
  @ApiQuery({ name: 'section', required: false, description: 'Seção clicada' })
  @ApiResponse({ status: 200, description: 'Comportamento registrado com sucesso', type: RaffleAnalyticsResponseDto })
  async registerUserBehavior(
    @Param('id') id: string,
    @Query('time_on_page') timeOnPage: number,
    @Query('bounce') didBounce?: string,
    @Query('section') clickedSection?: string,
  ) {
    return this.analyticsService.registerUserBehavior(
      +id,
      +timeOnPage,
      didBounce === 'true',
      clickedSection,
    );
  }

  @Post('raffle/:id/sale')
  @ApiOperation({ summary: 'Registrar uma venda de ticket' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiQuery({ name: 'count', required: false, description: 'Quantidade de tickets vendidos', type: Number })
  @ApiResponse({ status: 200, description: 'Venda registrada com sucesso', type: RaffleAnalyticsResponseDto })
  async registerTicketSale(
    @Param('id') id: string,
    @Query('count') ticketCount?: number,
  ) {
    return this.analyticsService.registerTicketSale(+id, ticketCount ? +ticketCount : 1);
  }

  @Delete('raffle/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover analytics de uma rifa' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiResponse({ status: 200, description: 'Analytics removido com sucesso' })
  async remove(@Param('id') id: string) {
    return this.analyticsService.remove(+id);
  }
}