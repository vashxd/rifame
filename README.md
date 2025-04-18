# RIFA.me - Plataforma de Rifas Digitais

RIFA.me é uma plataforma completa de rifas digitais com versões web responsiva e mobile (Android/iOS) que compartilham a mesma base de dados e funcionalidades. A plataforma permite que usuários criem, vendam, comprem e acompanhem rifas digitais, com sistema de pagamento integrado e mecanismo de sorteio transparente.

## Arquitetura

O projeto utiliza uma abordagem híbrida com:

- **Frontend Mobile**: Flutter para aplicações Android e iOS
- **Frontend Web**: Next.js para a versão web (melhor SEO e performance)
- **Backend**: API compartilhada em NestJS

### Banco de Dados

- **PostgreSQL**: Dados relacionais (usuários, rifas, transações)
- **MongoDB**: Dados não estruturados (configurações de rifas personalizadas)
- **Redis**: Cache e gerenciamento de sessões

### Serviços Adicionais

- **Firebase**: Autenticação e notificações push
- **Stripe/Mercado Pago**: Processamento de pagamentos
- **AWS S3/Firebase Storage**: Armazenamento de imagens
- **Socket.io**: Para funcionalidades em tempo real como sorteios ao vivo

### DevOps

- **Docker**: Containerização
- **CI/CD**: GitHub Actions ou GitLab CI
- **Monitoramento**: Sentry para rastrear erros

## Funcionalidades Principais

1. **Autenticação e Perfis**
   - Cadastro/login com e-mail, redes sociais e verificação em duas etapas
   - Perfis de usuários com histórico de rifas criadas/compradas
   - Sistema de reputação e avaliações

2. **Criação de Rifas**
   - Interface intuitiva para criar rifas com fotos, descrição, valor, quantidade de números
   - Sistema de agendamento de sorteio
   - Opções de personalização (temas, cores, etc.)
   - Definição de regras específicas para cada rifa

3. **Verificação e Segurança**
   - Processo de verificação de identidade para criadores de rifas (KYC)
   - Comprovação da existência e propriedade do prêmio
   - Sistema de garantia com depósito caução para grandes prêmios
   - Verificação de documentos via IA para reconhecimento de falsificações

4. **Compra de Rifas**
   - Visualização de todos os números disponíveis
   - Seleção manual ou aleatória de números
   - Carrinho de compras para múltiplas rifas
   - Histórico de compras e comprovantes

5. **Sistema de Pagamento**
   - Integração com múltiplos gateways (cartão, Pix, boleto)
   - Sistema de carteira digital interna
   - Controle de pagamentos recebidos para criadores
   - Comissionamento automático para a plataforma

6. **Realização de Sorteios**
   - Sorteio ao vivo transmitido pelo app/site
   - Algoritmo auditável baseado em geração de números aleatórios
   - Gravação e registro imutável dos sorteios para verificação posterior
   - Certificação digital do resultado

7. **Acompanhamento**
   - Dashboard para visualizar rifas em andamento
   - Notificações push/e-mail sobre atualizações
   - Contador regressivo para sorteios
   - Estatísticas de vendas para criadores

8. **Recursos Adicionais**
   - Sistema de afiliados para divulgação
   - Integração com redes sociais para compartilhamento
   - Suporte a rifas beneficentes com verificação de instituições
   - Marketplace de rifas em destaque
   - Programa de fidelidade/pontos

## Estrutura do Projeto

```
rifa-me/
├── backend/                # API NestJS
├── frontend/
│   ├── web/               # Aplicação Next.js
│   └── mobile/            # Aplicação Flutter
├── database/
│   ├── migrations/        # Migrações do banco de dados
│   └── schemas/           # Esquemas do banco de dados
└── docs/                  # Documentação
```

## Como Executar

### Pré-requisitos

- Node.js 16+
- Flutter SDK
- Docker e Docker Compose
- PostgreSQL
- MongoDB
- Redis

### Configuração

1. Clone o repositório
2. Configure as variáveis de ambiente
3. Execute os bancos de dados com Docker
4. Inicie o backend
5. Inicie o frontend web ou mobile

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.