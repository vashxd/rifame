import { Injectable } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

/**
 * Serviço responsável por processar eventos relacionados a analytics
 * Este serviço atua como um intermediário entre outros módulos e o serviço de analytics
 */
@Injectable()
export class AnalyticsEventsService {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Processa um evento de visualização de rifa
   */
  async onRaffleView(raffleId: number, userId?: number, metadata?: {
    source?: string;
    deviceType?: string;
    isUnique?: boolean;
  }) {
    const isUnique = metadata?.isUnique ?? false;
    const source = metadata?.source;
    const deviceType = metadata?.deviceType;

    return this.analyticsService.registerView(raffleId, isUnique, source, deviceType);
  }

  /**
   * Processa um evento de adição de ticket ao carrinho
   */
  async onTicketAddedToCart(raffleId: number, userId: number) {
    // Aqui podemos adicionar lógica adicional no futuro
    // Por enquanto, apenas registramos para análise
    return true;
  }

  /**
   * Processa um evento de abandono de carrinho
   */
  async onCartAbandoned(raffleId: number, userId: number) {
    return this.analyticsService.registerConversion(raffleId, true);
  }

  /**
   * Processa um evento de compra de ticket
   */
  async onTicketPurchase(raffleId: number, userId: number, ticketCount: number = 1) {
    // Registra a conversão (visualização para compra)
    await this.analyticsService.registerConversion(raffleId, false);
    
    // Registra a venda do ticket para análise de velocidade de vendas
    return this.analyticsService.registerTicketSale(raffleId, ticketCount);
  }

  /**
   * Processa um evento de interação do usuário com a página da rifa
   */
  async onUserInteraction(raffleId: number, userId: number, metadata: {
    timeOnPage: number;
    didBounce: boolean;
    clickedSection?: string;
  }) {
    return this.analyticsService.registerUserBehavior(
      raffleId,
      metadata.timeOnPage,
      metadata.didBounce,
      metadata.clickedSection
    );
  }

  /**
   * Processa um evento de compartilhamento de rifa
   */
  async onRaffleShare(raffleId: number, userId: number, platform: string) {
    // No futuro, podemos adicionar um novo tipo de análise para compartilhamentos
    // Por enquanto, apenas registramos como uma interação com a seção de compartilhamento
    return this.analyticsService.registerUserBehavior(
      raffleId,
      0, // Não afeta o tempo na página
      false, // Não é um bounce
      `share_${platform}` // Registra a plataforma de compartilhamento
    );
  }
}