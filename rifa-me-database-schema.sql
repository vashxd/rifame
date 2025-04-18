-- PostgreSQL: Esquema de Banco de Dados Relacional para RIFA.me

-- Tabela de Usuários
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    profile_image_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
    reputation_score DECIMAL(3,2) DEFAULT 0.00,
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP
);

-- Tabela de Métodos de Pagamento do Usuário
CREATE TABLE user_payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    payment_type VARCHAR(50) NOT NULL, -- credit_card, debit_card, pix
    provider VARCHAR(100) NOT NULL, -- visa, mastercard, etc
    token_reference VARCHAR(255) NOT NULL, -- token armazenado no gateway de pagamento
    last_four VARCHAR(4),
    expiry_date VARCHAR(7),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Documentos Verificados
CREATE TABLE verified_documents (
    document_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- identity, address_proof, prize_proof
    document_url VARCHAR(255) NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
    verification_notes TEXT,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias de Rifas
CREATE TABLE raffle_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Rifas
CREATE TABLE raffles (
    raffle_id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES raffle_categories(category_id),
    prize_description TEXT NOT NULL,
    prize_value DECIMAL(10,2) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL,
    total_tickets INTEGER NOT NULL,
    tickets_sold INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft', -- draft, pending_approval, active, completed, cancelled
    approval_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    approval_notes TEXT,
    draw_date TIMESTAMP,
    draw_method VARCHAR(50) DEFAULT 'automatic', -- automatic, manual, live
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    is_featured BOOLEAN DEFAULT FALSE,
    is_charity BOOLEAN DEFAULT FALSE,
    charity_percentage DECIMAL(5,2),
    minimum_sales_percentage DECIMAL(5,2) DEFAULT 0.00, -- porcentagem mínima para realizar o sorteio
    caution_deposit_amount DECIMAL(10,2) DEFAULT 0.00, -- valor caução para garantia
    has_auto_draw BOOLEAN DEFAULT TRUE -- se o sorteio será automático ao atingir 100%
);

-- Tabela de Imagens das Rifas
CREATE TABLE raffle_images (
    image_id SERIAL PRIMARY KEY,
    raffle_id INTEGER REFERENCES raffles(raffle_id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Números de Rifa
CREATE TABLE raffle_tickets (
    ticket_id SERIAL PRIMARY KEY,
    raffle_id INTEGER REFERENCES raffles(raffle_id) ON DELETE CASCADE,
    ticket_number INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'available', -- available, reserved, sold
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    transaction_id INTEGER, -- será preenchido após confirmar pagamento
    reservation_expires_at TIMESTAMP,
    purchased_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(raffle_id, ticket_number)
);

-- Tabela de Transações
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    raffle_id INTEGER REFERENCES raffles(raffle_id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method_id INTEGER REFERENCES user_payment_methods(payment_method_id) ON DELETE SET NULL,
    payment_gateway VARCHAR(100) NOT NULL, -- stripe, mercado_pago, etc
    payment_gateway_transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    transaction_type VARCHAR(50) NOT NULL, -- ticket_purchase, deposit, withdrawal, refund, commission
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Tabela para relacionar tickets a transações (1 transação pode comprar vários tickets)
CREATE TABLE transaction_tickets (
    transaction_id INTEGER REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    ticket_id INTEGER REFERENCES raffle_tickets(ticket_id) ON DELETE CASCADE,
    PRIMARY KEY (transaction_id, ticket_id)
);

-- Tabela de Sorteios
CREATE TABLE draws (
    draw_id SERIAL PRIMARY KEY,
    raffle_id INTEGER REFERENCES raffles(raffle_id) ON DELETE CASCADE,
    winning_ticket_id INTEGER REFERENCES raffle_tickets(ticket_id) ON DELETE SET NULL,
    draw_date TIMESTAMP NOT NULL,
    draw_method VARCHAR(50) NOT NULL, -- automatic, manual, live
    draw_seed VARCHAR(255), -- semente para verificação do algoritmo
    draw_algorithm TEXT, -- descrição ou identificador do algoritmo usado
    video_url VARCHAR(255), -- URL do vídeo do sorteio ao vivo
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled
    draw_result_hash VARCHAR(255), -- hash para garantir integridade do resultado
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    verified_by INTEGER REFERENCES users(user_id), -- admin que verificou
    verification_notes TEXT
);

-- Tabela de Notificações
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- system, raffle, payment, winner
    related_entity_type VARCHAR(50), -- raffle, transaction, draw
    related_entity_id INTEGER,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Avaliações
CREATE TABLE ratings (
    rating_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    rated_user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    raffle_id INTEGER REFERENCES raffles(raffle_id) ON DELETE SET NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Afiliados
CREATE TABLE affiliates (
    affiliate_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    affiliate_code VARCHAR(50) UNIQUE NOT NULL,
    commission_percentage DECIMAL(5,2) DEFAULT 5.00,
    total_referred_users INTEGER DEFAULT 0,
    total_commission DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Referências de Afiliados
CREATE TABLE affiliate_referrals (
    referral_id SERIAL PRIMARY KEY,
    affiliate_id INTEGER REFERENCES affiliates(affiliate_id) ON DELETE CASCADE,
    referred_user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    transaction_id INTEGER REFERENCES transactions(transaction_id) ON DELETE SET NULL,
    commission_amount DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, cancelled
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);

-- Tabela de Configurações do Sistema
CREATE TABLE system_settings (
    setting_id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL
);

-- Índices para melhorar performance
CREATE INDEX idx_raffle_tickets_raffle_id ON raffle_tickets(raffle_id);
CREATE INDEX idx_raffle_tickets_user_id ON raffle_tickets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_raffle_id ON transactions(raffle_id);
CREATE INDEX idx_raffles_creator_id ON raffles(creator_id);
CREATE INDEX idx_raffles_status ON raffles(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Inserir categorias iniciais
INSERT INTO raffle_categories (name, description) VALUES 
('Eletrônicos', 'Smartphones, TVs, Computadores e outros dispositivos eletrônicos'),
('Veículos', 'Carros, Motos, Bicicletas e outros veículos'),
('Imóveis', 'Casas, Apartamentos, Terrenos e outros imóveis'),
('Viagens', 'Pacotes de viagem, Passagens aéreas e Hospedagens'),
('Beneficente', 'Rifas com parte do valor destinado à instituições de caridade');

-- Inserir configurações iniciais do sistema
INSERT INTO system_settings (setting_key, setting_value, setting_description) VALUES
('platform_fee_percentage', '10.00', 'Percentual de comissão da plataforma sobre cada rifa'),
('min_ticket_price', '1.00', 'Valor mínimo permitido para um número de rifa'),
('max_tickets_per_raffle', '10000', 'Número máximo de tickets permitidos em uma rifa'),
('reservation_time_minutes', '15', 'Tempo em minutos que um ticket fica reservado antes de voltar a ficar disponível'),
('withdrawal_min_amount', '50.00', 'Valor mínimo para solicitação de saque'),
('featured_raffle_cost', '19.90', 'Custo para destacar uma rifa na página inicial');
