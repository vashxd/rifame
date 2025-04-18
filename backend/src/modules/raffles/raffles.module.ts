import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RafflesService } from './raffles.service';
import { RafflesController } from './raffles.controller';
import { Raffle } from './entities/raffle.entity';
import { RaffleImage } from './entities/raffle-image.entity';
import { RaffleTicket } from './entities/raffle-ticket.entity';
import { RaffleCategory } from './entities/raffle-category.entity';
import { UsersModule } from '../users/users.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Raffle, RaffleImage, RaffleTicket, RaffleCategory]),
    UsersModule,
    TransactionsModule,
  ],
  controllers: [RafflesController],
  providers: [RafflesService],
  exports: [RafflesService],
})
export class RafflesModule {}