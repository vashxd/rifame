// MongoDB: Esquema para dados não estruturados do RIFA.me

// Coleção para configurações personalizadas de rifas
db.raffle_custom_configs = {
  _id: ObjectId(), // ID único da configuração
  raffle_id: Number, // Referência ao ID da rifa no PostgreSQL
  creator_id: Number, // Referência ao ID do criador no PostgreSQL
  theme: {
    primary_color: String, // Ex: "#FF5733"
    secondary_color: String,
    background_image_url: String,
    font_family: String,
    button_style: String, // "rounded", "square", etc.
    custom_css: String // CSS personalizado opcional
  },
  display_settings: {
    show_progress_bar: Boolean,
    show_timer: Boolean,
    show_remaining_tickets: Boolean,
    show_recent_buyers: Boolean,
    display_mode: String // "grid", "list", "carousel"
  },
  advanced_settings: {
    allow_ticket_reservation: Boolean,
    allow_multiple_tickets_selection: Boolean,
    maximum_tickets_per_user: Number,
    display_buyer_names: Boolean,
    show_winner_publicly: Boolean
  },
  sharing_settings: {
    custom_share_message: String,
    social_image_url: String,
    custom_url_slug: String
  },
  notification_rules: [
    {
      trigger: String, // "sales_milestone", "time_before_draw", "winner_announced"
      threshold: Number, // porcentagem ou minutos, dependendo do trigger
      notification_type: String, // "email", "push", "sms"
      message_template: String
    }
  ],
  sales_milestones: [
    {
      percentage: Number, // Ex: 25, 50, 75
      action: String, // "notification", "price_change", "bonus"
      action_params: Object // parâmetros específicos da ação
    }
  ],
  dynamic_pricing: {
    enabled: Boolean,
    rules: [
      {
        trigger_percentage: Number, // Ex: 80 (quando 80% dos tickets forem vendidos)
        price_multiplier: Number // Ex: 1.2 (aumenta o preço em 20%)
      }
    ]
  },
  created_at: Date,
  updated_at: Date
};

// Coleção para estatísticas e análises
db.raffle_analytics = {
  _id: ObjectId(),
  raffle_id: Number, // Referência ao ID da rifa no PostgreSQL
  views: {
    total: Number,
    unique: Number,
    by_date: [
      {
        date: Date,
        count: Number,
        unique: Number
      }
    ],
    by_source: [
      {
        source: String, // "direct", "social", "affiliate"
        count: Number
      }
    ],
    by_device: [
      {
        device_type: String, // "mobile", "desktop", "tablet"
        count: Number
      }
    ]
  },
  conversion_rate: {
    views_to_purchase: Number, // porcentagem
    cart_abandonment: Number, // porcentagem
    by_date: [
      {
        date: Date,
        views_to_purchase: Number,
        cart_abandonment: Number
      }
    ]
  },
  user_behavior: {
    avg_time_on_page: Number, // em segundos
    bounce_rate: Number, // porcentagem
    most_clicked_sections: [
      {
        section: String,
        clicks: Number
      }
    ]
  },
  sales_velocity: {
    tickets_per_hour: Number,
    peak_hours: [
      {
        hour: Number, // 0-23
        tickets_sold: Number
      }
    ],
    tickets_by_weekday: [
      {
        weekday: Number, // 0-6 (domingo-sábado)
        tickets_sold: Number
      }
    ]
  },
  last_updated: Date
};

// Coleção para logs de eventos
db.event_logs = {
  _id: ObjectId(),
  entity_type: String, // "user", "raffle", "ticket", "transaction", "draw"
  entity_id: Number, // ID da entidade no PostgreSQL
  event_type: String, // "view", "create", "update", "delete", "purchase", "draw"
  user_id: Number, // ID do usuário que realizou a ação (se aplicável)
  ip_address: String,
  user_agent: String,
  details: Object, // Detalhes específicos do evento
  created_at: Date
};

// Coleção para cache de dados frequentemente acessados
db.cache_data = {
  _id: ObjectId(),
  cache_key: String, // Chave única para identificar os dados em cache
  data: Object, // Dados em cache
  expires_at: Date, // Data de expiração do cache
  created_at: Date
};

// Coleção para armazenar templates de e-mail personalizados
db.email_templates = {
  _id: ObjectId(),
  template_name: String, // "welcome", "ticket_purchase", "draw_announcement"
  subject: String,
  html_content: String,
  placeholders: [String], // Lista de placeholders disponíveis no template
  created_by: Number, // ID do admin que criou o template
  is_system: Boolean, // Se é um template do sistema ou personalizado
  created_at: Date,
  updated_at: Date
};
