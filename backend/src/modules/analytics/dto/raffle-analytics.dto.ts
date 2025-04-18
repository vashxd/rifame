import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ViewsByDateDto {
  @ApiProperty({ description: 'Data da visualização' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Número total de visualizações' })
  @IsNumber()
  count: number;

  @ApiProperty({ description: 'Número de visualizações únicas' })
  @IsNumber()
  unique: number;
}

class ViewsBySourceDto {
  @ApiProperty({ description: 'Fonte da visualização' })
  source: string;

  @ApiProperty({ description: 'Número de visualizações' })
  @IsNumber()
  count: number;
}

class ViewsByDeviceDto {
  @ApiProperty({ description: 'Tipo de dispositivo' })
  device_type: string;

  @ApiProperty({ description: 'Número de visualizações' })
  @IsNumber()
  count: number;
}

class ViewsDto {
  @ApiProperty({ description: 'Total de visualizações' })
  @IsNumber()
  total: number;

  @ApiProperty({ description: 'Visualizações únicas' })
  @IsNumber()
  unique: number;

  @ApiProperty({ description: 'Visualizações por data', type: [ViewsByDateDto] })
  @ValidateNested({ each: true })
  @Type(() => ViewsByDateDto)
  by_date: ViewsByDateDto[];

  @ApiProperty({ description: 'Visualizações por fonte', type: [ViewsBySourceDto] })
  @ValidateNested({ each: true })
  @Type(() => ViewsBySourceDto)
  by_source: ViewsBySourceDto[];

  @ApiProperty({ description: 'Visualizações por dispositivo', type: [ViewsByDeviceDto] })
  @ValidateNested({ each: true })
  @Type(() => ViewsByDeviceDto)
  by_device: ViewsByDeviceDto[];
}

class ConversionRateByDateDto {
  @ApiProperty({ description: 'Data da conversão' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Taxa de conversão de visualizações para compras' })
  @IsNumber()
  views_to_purchase: number;

  @ApiProperty({ description: 'Taxa de abandono de carrinho' })
  @IsNumber()
  cart_abandonment: number;
}

class ConversionRateDto {
  @ApiProperty({ description: 'Taxa de conversão de visualizações para compras' })
  @IsNumber()
  views_to_purchase: number;

  @ApiProperty({ description: 'Taxa de abandono de carrinho' })
  @IsNumber()
  cart_abandonment: number;

  @ApiProperty({ description: 'Taxas de conversão por data', type: [ConversionRateByDateDto] })
  @ValidateNested({ each: true })
  @Type(() => ConversionRateByDateDto)
  by_date: ConversionRateByDateDto[];
}

class MostClickedSectionDto {
  @ApiProperty({ description: 'Seção da página' })
  section: string;

  @ApiProperty({ description: 'Número de cliques' })
  @IsNumber()
  clicks: number;
}

class UserBehaviorDto {
  @ApiProperty({ description: 'Tempo médio na página (segundos)' })
  @IsNumber()
  avg_time_on_page: number;

  @ApiProperty({ description: 'Taxa de rejeição' })
  @IsNumber()
  bounce_rate: number;

  @ApiProperty({ description: 'Seções mais clicadas', type: [MostClickedSectionDto] })
  @ValidateNested({ each: true })
  @Type(() => MostClickedSectionDto)
  most_clicked_sections: MostClickedSectionDto[];
}

class PeakHourDto {
  @ApiProperty({ description: 'Hora do dia (0-23)' })
  @IsNumber()
  hour: number;

  @ApiProperty({ description: 'Número de tickets vendidos' })
  @IsNumber()
  tickets_sold: number;
}

class TicketsByWeekdayDto {
  @ApiProperty({ description: 'Dia da semana (0-6, onde 0 é domingo)' })
  @IsNumber()
  weekday: number;

  @ApiProperty({ description: 'Número de tickets vendidos' })
  @IsNumber()
  tickets_sold: number;
}

class SalesVelocityDto {
  @ApiProperty({ description: 'Tickets vendidos por hora' })
  @IsNumber()
  tickets_per_hour: number;

  @ApiProperty({ description: 'Horas de pico de vendas', type: [PeakHourDto] })
  @ValidateNested({ each: true })
  @Type(() => PeakHourDto)
  peak_hours: PeakHourDto[];

  @ApiProperty({ description: 'Tickets vendidos por dia da semana', type: [TicketsByWeekdayDto] })
  @ValidateNested({ each: true })
  @Type(() => TicketsByWeekdayDto)
  tickets_by_weekday: TicketsByWeekdayDto[];
}

export class CreateRaffleAnalyticsDto {
  @ApiProperty({ description: 'ID da rifa' })
  @IsNumber()
  raffle_id: number;

  @ApiProperty({ description: 'Dados de visualizações', type: ViewsDto })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ViewsDto)
  views?: ViewsDto;

  @ApiProperty({ description: 'Taxas de conversão', type: ConversionRateDto })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ConversionRateDto)
  conversion_rate?: ConversionRateDto;

  @ApiProperty({ description: 'Comportamento do usuário', type: UserBehaviorDto })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UserBehaviorDto)
  user_behavior?: UserBehaviorDto;

  @ApiProperty({ description: 'Velocidade de vendas', type: SalesVelocityDto })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => SalesVelocityDto)
  sales_velocity?: SalesVelocityDto;
}

export class UpdateRaffleAnalyticsDto extends CreateRaffleAnalyticsDto {}

export class RaffleAnalyticsResponseDto extends CreateRaffleAnalyticsDto {
  @ApiProperty({ description: 'Data da última atualização' })
  @IsDate()
  last_updated: Date;
}