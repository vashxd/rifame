import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrawsService } from './draws.service';
import { DrawsController } from './draws.controller';
import { Draw } from './entities/draw.entity';
import { RafflesModule } from '../raffles/raffles.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Draw]),
    RafflesModule,
    UsersModule,
  ],
  controllers: [DrawsController],
  providers: [DrawsService],
  exports: [DrawsService],
})
export class DrawsModule {}