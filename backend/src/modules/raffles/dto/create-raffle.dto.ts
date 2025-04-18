import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsDateString, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RaffleImageDto {
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;

  @IsNumber()
  @IsOptional()
  display_order?: number;
}

export class CreateRaffleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  category_id?: number;

  @IsString()
  @IsNotEmpty()
  prize_description: string;

  @IsNumber()
  @Min(0)
  prize_value: number;

  @IsNumber()
  @Min(0)
  ticket_price: number;

  @IsNumber()
  @Min(1)
  total_tickets: number;

  @IsDateString()
  @IsOptional()
  draw_date?: string;

  @IsString()
  @IsOptional()
  draw_method?: string; // automatic, manual, live

  @IsBoolean()
  @IsOptional()
  is_charity?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  charity_percentage?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  minimum_sales_percentage?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  caution_deposit_amount?: number;

  @IsBoolean()
  @IsOptional()
  has_auto_draw?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RaffleImageDto)
  @IsOptional()
  images?: RaffleImageDto[];
}