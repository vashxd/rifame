import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsEventsService } from './analytics-events.service';
import { AnalyticsDashboardService } from './analytics-dashboard.service';
import { AnalyticsDashboardController } from './analytics-dashboard.controller';
import { RaffleAnalytics, RaffleAnalyticsSchema } from './schemas/raffle-analytics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RaffleAnalytics.name, schema: RaffleAnalyticsSchema },
    ]),
  ],
  controllers: [AnalyticsController, AnalyticsDashboardController],
  providers: [AnalyticsService, AnalyticsEventsService, AnalyticsDashboardService],
  exports: [AnalyticsService, AnalyticsEventsService, AnalyticsDashboardService],
})
export class AnalyticsModule {}