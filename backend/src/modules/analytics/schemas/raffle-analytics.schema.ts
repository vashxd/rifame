import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'raffle_analytics' })
export class RaffleAnalytics extends Document {
  @Prop({ required: true })
  raffle_id: number;

  @Prop({ type: Object })
  views: {
    total: number;
    unique: number;
    by_date: [
      {
        date: Date;
        count: number;
        unique: number;
      }
    ];
    by_source: [
      {
        source: string;
        count: number;
      }
    ];
    by_device: [
      {
        device_type: string;
        count: number;
      }
    ];
  };

  @Prop({ type: Object })
  conversion_rate: {
    views_to_purchase: number;
    cart_abandonment: number;
    by_date: [
      {
        date: Date;
        views_to_purchase: number;
        cart_abandonment: number;
      }
    ];
  };

  @Prop({ type: Object })
  user_behavior: {
    avg_time_on_page: number;
    bounce_rate: number;
    most_clicked_sections: [
      {
        section: string;
        clicks: number;
      }
    ];
  };

  @Prop({ type: Object })
  sales_velocity: {
    tickets_per_hour: number;
    peak_hours: [
      {
        hour: number;
        tickets_sold: number;
      }
    ];
    tickets_by_weekday: [
      {
        weekday: number;
        tickets_sold: number;
      }
    ];
  };

  @Prop({ type: Date, default: Date.now })
  last_updated: Date;
}

export const RaffleAnalyticsSchema = SchemaFactory.createForClass(RaffleAnalytics);