import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsOptional()
  @IsString()
  @IsEnum(['pending', 'completed', 'failed', 'refunded'])
  status?: string;

  @IsOptional()
  @IsString()
  payment_gateway_transaction_id?: string;
}