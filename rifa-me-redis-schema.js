// Redis: Configuração para cache e sessões do RIFA.me

// 1. Chaves para sessões de usuário
// Formato: "session:{sessionId}"
// TTL: 24 horas (86400 segundos)
// Exemplo:
// SET session:a1b2c3d4e5f6 "{\"user_id\":123,\"email\":\"usuario@email.com\",\"roles\":[\"user\"],\"is_verified\":true}" EX 86400

// 2. Contadores de visualizações de rifas (para evitar sobrecarga no banco principal)
// Formato: "views:raffle:{raffleId}"
// TTL: Sem expiração (atualizado continuamente)
// Exemplo:
// INCR views:raffle:456

// 3. Cache de rifas em destaque na página inicial
// Formato: "featured_raffles"
// TTL: 15 minutos (900 segundos)
// Exemplo:
// SET featured_raffles "[{\"raffle_id\":123,\"title\":\"iPhone 15 Pro\",\"image_url\":\"...\",\"ticket_price\":10.00,\"total_tickets\":100,\"tickets_sold\":45}]" EX 900

// 4. Cache das rifas mais recentes
// Formato: "recent_raffles"
// TTL: 10 minutos (600 segundos)
// Exemplo:
// SET recent_raffles "[{\"raffle_id\":456,\"title\":\"PlayStation 5\",\"image_url\":\"...\",\"ticket_price\":5.00}]" EX 600

// 5. Cache de rifas por categoria
// Formato: "category_raffles:{categoryId}"
// TTL: 30 minutos (1800 segundos)
// Exemplo:
// SET category_raffles:1 "[{\"raffle_id\":789,\"title\":\"Smart TV 55\\\"\",\"image_url\":\"...\"}]" EX 1800

// 6. Locks para reserva de números de rifa (prevenir race conditions)
// Formato: "lock:ticket:{raffleId}:{ticketNumber}"
// TTL: 30 segundos (tempo suficiente para completar a transação)
// Exemplo:
// SET lock:ticket:123:45 "user_id:789" EX 30 NX

// 7. Fila de números de rifa reservados (para processamento em background)
// Formato usando Redis Lists:
// Exemplo:
// LPUSH reserved_tickets "{\"raffle_id\":123,\"ticket_id\":456,\"user_id\":789,\"expiration\":1615420800}"
// BRPOP reserved_tickets 0  // para processar o próximo da fila

// 8. Cache de sorteios agendados para as próximas 24 horas
// Formato: "upcoming_draws"
// TTL: 1 hora (3600 segundos)
// Exemplo:
// SET upcoming_draws "[{\"draw_id\":123,\"raffle_id\":456,\"draw_date\":\"2023-08-30T18:00:00Z\"}]" EX 3600

// 9. Contadores de tickets disponíveis por rifa
// Formato: "available_tickets:raffle:{raffleId}"
// TTL: Sem expiração (atualizado continuamente)
// Exemplo:
// SET available_tickets:raffle:123 55

// 10. Rate limiting para APIs (prevenção de abuso)
// Formato: "rate_limit:{ip_address}"
// TTL: 1 minuto (60 segundos)
// Exemplo:
// INCR rate_limit:192.168.1.1
// EXPIRE rate_limit:192.168.1.1 60

// 11. Cache de estatísticas de usuário
// Formato: "user_stats:{userId}"
// TTL: 15 minutos (900 segundos)
// Exemplo:
// SET user_stats:123 "{\"raffles_created\":5,\"tickets_purchased\":27,\"wins\":2}" EX 900

// 12. Dados temporários de transações em andamento
// Formato: "transaction:{transactionId}"
// TTL: 30 minutos (1800 segundos)
// Exemplo:
// SET transaction:abc123 "{\"user_id\":456,\"raffle_id\":789,\"tickets\":[1,2,3],\"amount\":15.00,\"status\":\"processing\"}" EX 1800

// 13. Cache de resultados de sorteios recentes
// Formato: "recent_draws"
// TTL: 1 hora (3600 segundos)
// Exemplo:
// SET recent_draws "[{\"raffle_id\":123,\"winner_ticket\":45,\"winner_name\":\"João S.\",\"prize\":\"iPhone 15\"}]" EX 3600

// 14. Notificações em tempo real pendentes
// Formato usando Redis Pub/Sub:
// Exemplo (publicação):
// PUBLISH user_notifications:123 "{\"type\":\"winner\",\"message\":\"Parabéns! Você ganhou a rifa #456!\"}"

// 15. Configurações do sistema em cache
// Formato: "system_settings"
// TTL: 1 hora (3600 segundos)
// Exemplo:
// SET system_settings "{\"platform_fee\":10,\"min_ticket_price\":1.00,\"reservation_time\":15}" EX 3600

// 16. Cache de tokens de verificação
// Formato: "verification_token:{token}"
// TTL: 24 horas (86400 segundos)
// Exemplo:
// SET verification_token:xyz789 "{\"user_id\":123,\"type\":\"email_verification\"}" EX 86400

// 17. Armazenamento temporário de sementes para sorteios
// Formato: "draw_seed:{drawId}"
// TTL: 7 dias (604800 segundos)
// Exemplo:
// SET draw_seed:123 "f7d9a1b3c5e8d6a2b4c9f0e7d3a5b1c8" EX 604800

// Configuração recomendada do Redis:
// - Habilitar persistência (RDB e AOF)
// - Configurar monitoramento de memória
// - Implementar replicação para alta disponibilidade
// - Configurar política de exclusão: volatile-lru (least recently used)
