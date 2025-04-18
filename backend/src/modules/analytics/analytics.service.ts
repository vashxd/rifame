import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RaffleAnalytics } from './schemas/raffle-analytics.schema';
import { CreateRaffleAnalyticsDto, UpdateRaffleAnalyticsDto } from './dto/raffle-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(RaffleAnalytics.name)
    private readonly raffleAnalyticsModel: Model<RaffleAnalytics>,
  ) {}

  /**
   * Cria um novo registro de analytics para uma rifa
   */
  async create(createRaffleAnalyticsDto: CreateRaffleAnalyticsDto): Promise<RaffleAnalytics> {
    const createdAnalytics = new this.raffleAnalyticsModel(createRaffleAnalyticsDto);
    return createdAnalytics.save();
  }

  /**
   * Busca analytics de uma rifa específica pelo ID
   */
  async findByRaffleId(raffleId: number): Promise<RaffleAnalytics> {
    return this.raffleAnalyticsModel.findOne({ raffle_id: raffleId }).exec();
  }

  /**
   * Atualiza os dados de analytics de uma rifa
   */
  async update(raffleId: number, updateRaffleAnalyticsDto: UpdateRaffleAnalyticsDto): Promise<RaffleAnalytics> {
    // Atualiza a data da última atualização
    updateRaffleAnalyticsDto['last_updated'] = new Date();
    
    return this.raffleAnalyticsModel
      .findOneAndUpdate(
        { raffle_id: raffleId },
        { $set: updateRaffleAnalyticsDto },
        { new: true, upsert: true }
      )
      .exec();
  }

  /**
   * Registra uma nova visualização para uma rifa
   */
  async registerView(raffleId: number, isUnique: boolean, source?: string, deviceType?: string): Promise<RaffleAnalytics> {
    const analytics = await this.findByRaffleId(raffleId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Se não existir analytics para esta rifa, cria um novo
    if (!analytics) {
      const newAnalytics: CreateRaffleAnalyticsDto = {
        raffle_id: raffleId,
        views: {
          total: 1,
          unique: isUnique ? 1 : 0,
          by_date: [
            {
              date: today,
              count: 1,
              unique: isUnique ? 1 : 0,
            },
          ],
          by_source: source
            ? [
                {
                  source,
                  count: 1,
                },
              ]
            : [],
          by_device: deviceType
            ? [
                {
                  device_type: deviceType,
                  count: 1,
                },
              ]
            : [],
        },
      };
      return this.create(newAnalytics);
    }

    // Atualiza os contadores de visualização
    const update: any = {
      $inc: {
        'views.total': 1,
      },
      $set: {
        last_updated: new Date(),
      },
    };

    if (isUnique) {
      update.$inc['views.unique'] = 1;
    }

    // Verifica se já existe um registro para a data atual
    const dateExists = analytics.views?.by_date?.some(
      (item) => new Date(item.date).toDateString() === today.toDateString()
    );

    if (dateExists) {
      // Incrementa o contador para a data existente
      update.$inc['views.by_date.$[date].count'] = 1;
      if (isUnique) {
        update.$inc['views.by_date.$[date].unique'] = 1;
      }
    } else {
      // Adiciona um novo registro para a data atual
      update.$push = {
        'views.by_date': {
          date: today,
          count: 1,
          unique: isUnique ? 1 : 0,
        },
      };
    }

    // Atualiza ou adiciona a fonte, se fornecida
    if (source) {
      const sourceExists = analytics.views?.by_source?.some(
        (item) => item.source === source
      );

      if (sourceExists) {
        update.$inc['views.by_source.$[source].count'] = 1;
      } else {
        if (!update.$push) update.$push = {};
        update.$push['views.by_source'] = {
          source,
          count: 1,
        };
      }
    }

    // Atualiza ou adiciona o tipo de dispositivo, se fornecido
    if (deviceType) {
      const deviceExists = analytics.views?.by_device?.some(
        (item) => item.device_type === deviceType
      );

      if (deviceExists) {
        update.$inc['views.by_device.$[device].count'] = 1;
      } else {
        if (!update.$push) update.$push = {};
        update.$push['views.by_device'] = {
          device_type: deviceType,
          count: 1,
        };
      }
    }

    // Define os array filters para atualizar os elementos corretos nos arrays
    const arrayFilters = [
      { 'date.date': { $gte: today, $lt: new Date(today.getTime() + 86400000) } },
    ];

    if (source) {
      arrayFilters.push({ 'source.source': source });
    }

    if (deviceType) {
      arrayFilters.push({ 'device.device_type': deviceType });
    }

    return this.raffleAnalyticsModel
      .findOneAndUpdate({ raffle_id: raffleId }, update, {
        new: true,
        arrayFilters,
      })
      .exec();
  }

  /**
   * Registra uma conversão (compra de ticket)
   */
  async registerConversion(raffleId: number, isCartAbandoned: boolean = false): Promise<RaffleAnalytics> {
    const analytics = await this.findByRaffleId(raffleId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Se não existir analytics para esta rifa, cria um novo
    if (!analytics) {
      const newAnalytics: CreateRaffleAnalyticsDto = {
        raffle_id: raffleId,
        conversion_rate: {
          views_to_purchase: isCartAbandoned ? 0 : 1,
          cart_abandonment: isCartAbandoned ? 1 : 0,
          by_date: [
            {
              date: today,
              views_to_purchase: isCartAbandoned ? 0 : 1,
              cart_abandonment: isCartAbandoned ? 1 : 0,
            },
          ],
        },
      };
      return this.create(newAnalytics);
    }

    // Atualiza os contadores de conversão
    const update: any = {
      $set: {
        last_updated: new Date(),
      },
    };

    if (isCartAbandoned) {
      update.$inc = {
        'conversion_rate.cart_abandonment': 1,
      };
    } else {
      update.$inc = {
        'conversion_rate.views_to_purchase': 1,
      };
    }

    // Verifica se já existe um registro para a data atual
    const dateExists = analytics.conversion_rate?.by_date?.some(
      (item) => new Date(item.date).toDateString() === today.toDateString()
    );

    if (dateExists) {
      // Incrementa o contador para a data existente
      if (isCartAbandoned) {
        update.$inc['conversion_rate.by_date.$[date].cart_abandonment'] = 1;
      } else {
        update.$inc['conversion_rate.by_date.$[date].views_to_purchase'] = 1;
      }
    } else {
      // Adiciona um novo registro para a data atual
      update.$push = {
        'conversion_rate.by_date': {
          date: today,
          views_to_purchase: isCartAbandoned ? 0 : 1,
          cart_abandonment: isCartAbandoned ? 1 : 0,
        },
      };
    }

    // Define os array filters para atualizar os elementos corretos nos arrays
    const arrayFilters = [
      { 'date.date': { $gte: today, $lt: new Date(today.getTime() + 86400000) } },
    ];

    return this.raffleAnalyticsModel
      .findOneAndUpdate({ raffle_id: raffleId }, update, {
        new: true,
        arrayFilters,
      })
      .exec();
  }

  /**
   * Registra comportamento do usuário
   */
  async registerUserBehavior(
    raffleId: number,
    timeOnPage: number,
    didBounce: boolean,
    clickedSection?: string
  ): Promise<RaffleAnalytics> {
    const analytics = await this.findByRaffleId(raffleId);

    // Se não existir analytics para esta rifa, cria um novo
    if (!analytics) {
      const newAnalytics: CreateRaffleAnalyticsDto = {
        raffle_id: raffleId,
        user_behavior: {
          avg_time_on_page: timeOnPage,
          bounce_rate: didBounce ? 1 : 0,
          most_clicked_sections: clickedSection
            ? [
                {
                  section: clickedSection,
                  clicks: 1,
                },
              ]
            : [],
        },
      };
      return this.create(newAnalytics);
    }

    // Calcula a nova média de tempo na página
    let newAvgTime = timeOnPage;
    let totalViews = 1;

    if (analytics.views?.total) {
      totalViews = analytics.views.total;
      const currentTotalTime = analytics.user_behavior?.avg_time_on_page * (totalViews - 1);
      newAvgTime = (currentTotalTime + timeOnPage) / totalViews;
    }

    // Calcula a nova taxa de rejeição
    let newBounceRate = didBounce ? 1 : 0;
    if (analytics.user_behavior?.bounce_rate !== undefined) {
      const currentBounces = analytics.user_behavior.bounce_rate * (totalViews - 1);
      newBounceRate = (currentBounces + (didBounce ? 1 : 0)) / totalViews;
    }

    // Prepara a atualização
    const update: any = {
      $set: {
        'user_behavior.avg_time_on_page': newAvgTime,
        'user_behavior.bounce_rate': newBounceRate,
        last_updated: new Date(),
      },
    };

    // Atualiza a seção clicada, se fornecida
    if (clickedSection) {
      const sectionExists = analytics.user_behavior?.most_clicked_sections?.some(
        (item) => item.section === clickedSection
      );

      if (sectionExists) {
        update.$inc = {
          'user_behavior.most_clicked_sections.$[section].clicks': 1,
        };
      } else {
        update.$push = {
          'user_behavior.most_clicked_sections': {
            section: clickedSection,
            clicks: 1,
          },
        };
      }
    }

    // Define os array filters para atualizar os elementos corretos nos arrays
    const arrayFilters = [];
    if (clickedSection) {
      arrayFilters.push({ 'section.section': clickedSection });
    }

    return this.raffleAnalyticsModel
      .findOneAndUpdate({ raffle_id: raffleId }, update, {
        new: true,
        arrayFilters: arrayFilters.length > 0 ? arrayFilters : undefined,
      })
      .exec();
  }

  /**
   * Registra uma venda de ticket
   */
  async registerTicketSale(raffleId: number, ticketCount: number = 1): Promise<RaffleAnalytics> {
    const analytics = await this.findByRaffleId(raffleId);
    const now = new Date();
    const hour = now.getHours();
    const weekday = now.getDay(); // 0 (Domingo) a 6 (Sábado)

    // Se não existir analytics para esta rifa, cria um novo
    if (!analytics) {
      const newAnalytics: CreateRaffleAnalyticsDto = {
        raffle_id: raffleId,
        sales_velocity: {
          tickets_per_hour: ticketCount,
          peak_hours: [
            {
              hour,
              tickets_sold: ticketCount,
            },
          ],
          tickets_by_weekday: [
            {
              weekday,
              tickets_sold: ticketCount,
            },
          ],
        },
      };
      return this.create(newAnalytics);
    }

    // Calcula a nova velocidade de vendas (tickets por hora)
    let newTicketsPerHour = ticketCount;
    if (analytics.sales_velocity?.tickets_per_hour !== undefined) {
      // Simplificação: média móvel simples
      newTicketsPerHour = (analytics.sales_velocity.tickets_per_hour + ticketCount) / 2;
    }

    // Prepara a atualização
    const update: any = {
      $set: {
        'sales_velocity.tickets_per_hour': newTicketsPerHour,
        last_updated: new Date(),
      },
    };

    // Atualiza as horas de pico
    const hourExists = analytics.sales_velocity?.peak_hours?.some(
      (item) => item.hour === hour
    );

    if (hourExists) {
      update.$inc = {
        ...update.$inc,
        'sales_velocity.peak_hours.$[hour].tickets_sold': ticketCount,
      };
    } else {
      update.$push = {
        ...update.$push,
        'sales_velocity.peak_hours': {
          hour,
          tickets_sold: ticketCount,
        },
      };
    }

    // Atualiza os tickets por dia da semana
    const weekdayExists = analytics.sales_velocity?.tickets_by_weekday?.some(
      (item) => item.weekday === weekday
    );

    if (weekdayExists) {
      update.$inc = {
        ...update.$inc,
        'sales_velocity.tickets_by_weekday.$[weekday].tickets_sold': ticketCount,
      };
    } else {
      update.$push = {
        ...update.$push,
        'sales_velocity.tickets_by_weekday': {
          weekday,
          tickets_sold: ticketCount,
        },
      };
    }

    // Define os array filters para atualizar os elementos corretos nos arrays
    const arrayFilters = [
      { 'hour.hour': hour },
      { 'weekday.weekday': weekday },
    ];

    return this.raffleAnalyticsModel
      .findOneAndUpdate({ raffle_id: raffleId }, update, {
        new: true,
        arrayFilters,
      })
      .exec();
  }

  /**
   * Remove os dados de analytics de uma rifa
   */
  async remove(raffleId: number): Promise<any> {
    return this.raffleAnalyticsModel.deleteOne({ raffle_id: raffleId }).exec();
  }
}