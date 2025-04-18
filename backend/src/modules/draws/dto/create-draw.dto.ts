import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDrawDto {
  @IsNotEmpty()
  @IsNumber()
  raffle_id: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  draw_date: Date;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['automatic', 'manual', 'live'])
  draw_method: string;

  @IsOptional()
  @IsString()
  draw_seed?: string;

  @IsOptional()
  @IsString()
  draw_algorithm?: string;

  @IsOptional()
  @IsString()
  video_url?: string;
}