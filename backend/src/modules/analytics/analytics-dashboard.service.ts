import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RaffleAnalytics } from './schemas/raffle-analytics.schema';

/**
 * Serviço responsável por fornecer dados agregados para dashboards
 */
@Injectable()
export class AnalyticsDashboardService {
  constructor(
    @InjectModel(RaffleAnalytics.name)
    private readonly raffleAnalyticsModel: Model<RaffleAnalytics>,
  ) {}

  /**
   * Obtém um resumo das estatísticas de uma rifa específica
   */
  async getRaffleSummary(raffleId: number) {
    const analytics = await this.raffleAnalyticsModel.findOne({ raffle_id: raffleId }).exec();
    
    if (!analytics) {
      return {
        views: { total: 0, unique: 0 },
        conversion_rate: { views_to_purchase: 0, cart_abandonment: 0 },
        user_behavior: { avg_time_on_page: 0, bounce_rate: 0 },
        sales_velocity: { tickets_per_hour: 0 }
      };
    }

    return {
      views: {
        total: analytics.views?.total || 0,
        unique: analytics.views?.unique || 0,
      },
      conversion_rate: {
        views_to_purchase: analytics.conversion_rate?.views_to_purchase || 0,
        cart_abandonment: analytics.conversion_rate?.cart_abandonment || 0,
      },
      user_behavior: {
        avg_time_on_page: analytics.user_behavior?.avg_time_on_page || 0,
        bounce_rate: analytics.user_behavior?.bounce_rate || 0,
      },
      sales_velocity: {
        tickets_per_hour: analytics.sales_velocity?.tickets_per_hour || 0,
      },
    };
  }

  /**
   * Obtém dados de visualizações por data para uma rifa específica
   */
  async getViewsByDate(raffleId: number, startDate?: Date, endDate?: Date) {
    const analytics = await this.raffleAnalyticsModel.findOne({ raffle_id: raffleId }).exec();
    
    if (!analytics || !analytics.views?.by_date?.length) {
      return [];
    }

    let viewsByDate = analytics.views.by_date;

    // Filtra por intervalo de datas, se fornecido
    if (startDate || endDate) {
      viewsByDate = viewsByDate.filter(item => {
        const itemDate = new Date(item.date);
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      });
    }

    // Ordena por data
    return viewsByDate.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Obtém dados de vendas por dia da semana para uma rifa específica
   */
  async getSalesByWeekday(raffleId: number) {
    const analytics = await this.raffleAnalyticsModel.findOne({ raffle_id: raffleId }).exec();
    
    if (!analytics || !analytics.sales_velocity?.tickets_by_weekday?.length) {
      // Retorna um array com zeros para todos os dias da semana
      return Array.from({ length: 7 }, (_, i) => ({ weekday: i, tickets_sold: 0 }));
    }

    // Garante que todos os dias da semana estejam representados
    const salesByWeekday = [...analytics.sales_velocity.tickets_by_weekday];
    const weekdays = salesByWeekday.map(item => item.weekday);
    
    for (let i = 0; i < 7; i++) {
      if (!weekdays.includes(i)) {
        salesByWeekday.push({ weekday: i, tickets_sold: 0 });
      }
    }

    // Ordena por dia da semana
    return salesByWeekday.sort((a, b) => a.weekday - b.weekday);
  }

  /**
   * Obtém dados de vendas por hora do dia para uma rifa específica
   */
  async getSalesByHour(raffleId: number) {
    const analytics = await this.raffleAnalyticsModel.findOne({ raffle_id: raffleId }).exec();
    
    if (!analytics || !analytics.sales_velocity?.peak_hours?.length) {
      // Retorna um array com zeros para todas as horas do dia
      return Array.from({ length: 24 }, (_, i) => ({ hour: i, tickets_sold: 0 }));
    }

    // Garante que todas as horas estejam representadas
    const salesByHour = [...analytics.sales_velocity.peak_hours];
    const hours = salesByHour.map(item => item.hour);
    
    for (let i = 0; i < 24; i++) {
      if (!hours.includes(i)) {
        salesByHour.push({ hour: i, tickets_sold: 0 });
      }
    }

    // Ordena por hora
    return salesByHour.sort((a, b) => a.hour - b.hour);
  }

  /**
   * Obtém as fontes de tráfego mais populares para uma rifa específica
   */
  async getTopTrafficSources(raffleId: number, limit: number = 5) {
    const analytics = await this.raffleAnalyticsModel.findOne({ raffle_id: raffleId }).exec();
    
    if (!analytics || !analytics.views?.by_source?.length) {
      return [];
    }

    // Ordena por contagem e limita ao número especificado
    return [...analytics.views.by_source]
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Obtém os dispositivos mais usados para acessar uma rifa específica
   */
  async getDeviceBreakdown(raffleId: number) {
    const analytics = await this.raffleAnalyticsModel.findOne({ raffle_id: raffleId }).exec();
    
    if (!analytics || !analytics.views?.by_device?.length) {
      return [];
    }

    // Ordena por contagem
    return [...analytics.views.by_device].sort((a, b) => b.count - a.count);
  }

  /**
   * Obtém as seções mais clicadas de uma rifa específica
   */
  async getMostClickedSections(raffleId: number, limit: number = 5) {
    const analytics = await this.raffleAnalyticsModel.findOne({ raffle_id: raffleId }).exec();
    
    if (!analytics || !analytics.user_behavior?.most_clicked_sections?.length) {
      return [];
    }

    // Ordena por número de cliques e limita ao número especificado
    return [...analytics.user_behavior.most_clicked_sections]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  }

  /**
   * Obtém dados comparativos entre múltiplas rifas
   */
  async compareRaffles(raffleIds: number[]) {
    if (!raffleIds.length) {
      return [];
    }

    const analytics = await this.raffleAnalyticsModel
      .find({ raffle_id: { $in: raffleIds } })
      .exec();

    return raffleIds.map(id => {
      const raffleAnalytics = analytics.find(a => a.raffle_id === id);
      
      if (!raffleAnalytics) {
        return {
          raffle_id: id,
          total_views: 0,
          conversion_rate: 0,
          tickets_per_hour: 0,
        };
      }

      return {
        raffle_id: id,
        total_views: raffleAnalytics.views?.total || 0,
        conversion_rate: raffleAnalytics.conversion_rate?.views_to_purchase || 0,
        tickets_per_hour: raffleAnalytics.sales_velocity?.tickets_per_hour || 0,
      };
    });
  }
}