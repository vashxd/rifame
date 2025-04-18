import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AnalyticsDashboardService } from './analytics-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('analytics-dashboard')
@Controller('analytics/dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsDashboardController {
  constructor(private readonly dashboardService: AnalyticsDashboardService) {}

  @Get('raffle/:id/summary')
  @ApiOperation({ summary: 'Obter resumo das estatísticas de uma rifa' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiResponse({ status: 200, description: 'Resumo obtido com sucesso' })
  async getRaffleSummary(@Param('id') id: string) {
    return this.dashboardService.getRaffleSummary(+id);
  }

  @Get('raffle/:id/views-by-date')
  @ApiOperation({ summary: 'Obter visualizações por data para uma rifa' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiQuery({ name: 'start_date', required: false, description: 'Data inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'end_date', required: false, description: 'Data final (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Dados obtidos com sucesso' })
  async getViewsByDate(
    @Param('id') id: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.dashboardService.getViewsByDate(+id, start, end);
  }

  @Get('raffle/:id/sales-by-weekday')
  @ApiOperation({ summary: 'Obter vendas por dia da semana para uma rifa' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiResponse({ status: 200, description: 'Dados obtidos com sucesso' })
  async getSalesByWeekday(@Param('id') id: string) {
    return this.dashboardService.getSalesByWeekday(+id);
  }

  @Get('raffle/:id/sales-by-hour')
  @ApiOperation({ summary: 'Obter vendas por hora do dia para uma rifa' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiResponse({ status: 200, description: 'Dados obtidos com sucesso' })
  async getSalesByHour(@Param('id') id: string) {
    return this.dashboardService.getSalesByHour(+id);
  }

  @Get('raffle/:id/top-traffic-sources')
  @ApiOperation({ summary: 'Obter as fontes de tráfego mais populares para uma rifa' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de resultados' })
  @ApiResponse({ status: 200, description: 'Dados obtidos com sucesso' })
  async getTopTrafficSources(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ) {
    return this.dashboardService.getTopTrafficSources(+id, limit ? +limit : 5);
  }

  @Get('raffle/:id/device-breakdown')
  @ApiOperation({ summary: 'Obter a distribuição de dispositivos para uma rifa' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiResponse({ status: 200, description: 'Dados obtidos com sucesso' })
  async getDeviceBreakdown(@Param('id') id: string) {
    return this.dashboardService.getDeviceBreakdown(+id);
  }

  @Get('raffle/:id/most-clicked-sections')
  @ApiOperation({ summary: 'Obter as seções mais clicadas de uma rifa' })
  @ApiParam({ name: 'id', description: 'ID da rifa' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de resultados' })
  @ApiResponse({ status: 200, description: 'Dados obtidos com sucesso' })
  async getMostClickedSections(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ) {
    return this.dashboardService.getMostClickedSections(+id, limit ? +limit : 5);
  }

  @Get('compare-raffles')
  @ApiOperation({ summary: 'Comparar estatísticas entre múltiplas rifas' })
  @ApiQuery({ name: 'ids', required: true, description: 'IDs das rifas separados por vírgula' })
  @ApiResponse({ status: 200, description: 'Dados comparativos obtidos com sucesso' })
  async compareRaffles(@Query('ids') ids: string) {
    const raffleIds = ids.split(',').map(id => +id.trim());
    return this.dashboardService.compareRaffles(raffleIds);
  }
}