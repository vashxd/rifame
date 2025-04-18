import { PartialType } from '@nestjs/mapped-types';
import { CreateDrawDto } from './create-draw.dto';
import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateDrawDto extends PartialType(CreateDrawDto) {
  @IsOptional()
  @IsString()
  @IsEnum(['scheduled', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsNumber()
  winning_ticket_id?: number;

  @IsOptional()
  @IsString()
  draw_result_hash?: string;

  @IsOptional()
  @IsString()
  verification_notes?: string;
}