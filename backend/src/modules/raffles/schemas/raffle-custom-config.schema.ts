import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'raffle_custom_configs' })
export class RaffleCustomConfig extends Document {
  @Prop({ required: true })
  raffle_id: number;

  @Prop({ required: true })
  creator_id: number;

  @Prop({ type: Object })
  theme: {
    primary_color: string;
    secondary_color: string;
    background_image_url: string;
    font_family: string;
    button_style: string;
    custom_css: string;
  };

  @Prop({ type: Object })
  display_settings: {
    show_progress_bar: boolean;
    show_timer: boolean;
    show_remaining_tickets: boolean;
    show_recent_buyers: boolean;
    display_mode: string;
  };

  @Prop({ type: Object })
  advanced_settings: {
    allow_ticket_reservation: boolean;
    allow_multiple_tickets_selection: boolean;
    maximum_tickets_per_user: number;
    display_buyer_names: boolean;
    show_winner_publicly: boolean;
  };

  @Prop({ type: Object })
  sharing_settings: {
    custom_share_message: string;
    social_image_url: string;
    custom_url_slug: string;
  };

  @Prop({ type: Array })
  notification_rules: [
    {
      trigger: string;
      threshold: number;
      notification_type: string;
      message_template: string;
    }
  ];

  @Prop({ type: Array })
  sales_milestones: [
    {
      percentage: number;
      action: string;
      action_params: Record<string, any>;
    }
  ];

  @Prop({ type: Object })
  dynamic_pricing: {
    enabled: boolean;
    rules: [
      {
        trigger_percentage: number;
        price_multiplier: number;
      }
    ];
  };

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: Date.now })
  updated_at: Date;
}

export const RaffleCustomConfigSchema = SchemaFactory.createForClass(RaffleCustomConfig);