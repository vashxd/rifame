import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RafflesModule } from './modules/raffles/raffles.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { DrawsModule } from './modules/draws/draws.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AffiliatesModule } from './modules/affiliates/affiliates.module';
import { SystemModule } from './modules/system/system.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    
    // Configuração do PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', 'localhost'),
        port: configService.get('POSTGRES_PORT', 5432),
        username: configService.get('POSTGRES_USER', 'postgres'),
        password: configService.get('POSTGRES_PASSWORD', 'postgres'),
        database: configService.get('POSTGRES_DB', 'rifame'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV', 'development') !== 'production',
        logging: configService.get('NODE_ENV', 'development') !== 'production',
      }),
    }),
    
    // Configuração do MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI', 'mongodb://localhost:27017/rifame'),
      }),
    }),
    
    // Módulos da aplicação
    UsersModule,
    AuthModule,
    RafflesModule,
    TransactionsModule,
    DrawsModule,
    NotificationsModule,
    AffiliatesModule,
    SystemModule,
    AnalyticsModule,
  ],
})
export class AppModule {}