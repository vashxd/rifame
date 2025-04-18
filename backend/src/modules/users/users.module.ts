import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserPaymentMethod } from './entities/user-payment-method.entity';
import { VerifiedDocument } from './entities/verified-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPaymentMethod, VerifiedDocument]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}