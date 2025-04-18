import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @IsNumber()
  raffle_id?: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsNumber()
  payment_method_id?: number;

  @IsNotEmpty()
  @IsString()
  payment_gateway: string; // stripe, mercado_pago, etc

  @IsOptional()
  @IsString()
  payment_gateway_transaction_id?: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['ticket_purchase', 'deposit', 'withdrawal', 'refund', 'commission'])
  transaction_type: string;

  @IsOptional()
  ticket_ids?: number[];
}