import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    // Garantir que o usuário só pode criar transações para si mesmo
    if (createTransactionDto.user_id && createTransactionDto.user_id !== req.user.user_id && !req.user.is_admin) {
      throw new BadRequestException('You can only create transactions for yourself');
    }
    
    // Se não for especificado, usar o ID do usuário autenticado
    if (!createTransactionDto.user_id) {
      createTransactionDto.user_id = req.user.user_id;
    }
    
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  findMyTransactions(@Request() req) {
    return this.transactionsService.findByUserId(req.user.user_id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.transactionsService.findOne(+id, req.user);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard)
  confirmPayment(@Param('id') id: string, @Request() req) {
    return this.transactionsService.confirmPayment(+id, req.user);
  }

  @Patch(':id/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  refundPayment(@Param('id') id: string) {
    return this.transactionsService.refundPayment(+id);
  }

  @Post('webhook')
  paymentWebhook(@Body() webhookData: any) {
    return this.transactionsService.processPaymentWebhook(webhookData);
  }

  @Get('raffle/:raffleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findByRaffle(@Param('raffleId') raffleId: string) {
    return this.transactionsService.findByRaffleId(+raffleId);
  }
}