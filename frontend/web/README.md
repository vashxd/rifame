# RIFA.me - Frontend Web

Este é o frontend web da plataforma RIFA.me, desenvolvido com Next.js para oferecer uma experiência de usuário moderna e responsiva.

## Tecnologias Utilizadas

- Next.js - Framework React para renderização híbrida (SSR/SSG)
- TypeScript - Superset tipado de JavaScript
- Chakra UI - Biblioteca de componentes para interface de usuário
- SWR - Biblioteca para gerenciamento de estado e cache
- Axios - Cliente HTTP para comunicação com a API
- Socket.io-client - Para funcionalidades em tempo real

## Estrutura do Projeto

```
/src
  /components     # Componentes reutilizáveis
  /contexts       # Contextos React (auth, theme, etc)
  /hooks          # Hooks personalizados
  /pages          # Páginas da aplicação
  /services       # Serviços para comunicação com a API
  /styles         # Estilos globais e temas
  /types          # Definições de tipos TypeScript
  /utils          # Funções utilitárias
```

## Funcionalidades Principais

- Autenticação e gerenciamento de perfil de usuário
- Criação, visualização e compra de rifas
- Sistema de pagamento integrado
- Acompanhamento de sorteios em tempo real
- Dashboard para gerenciamento de rifas e transações
- Sistema de notificações

## Instalação e Execução

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure as variáveis de ambiente:
   ```
   cp .env.example .env.local
   ```
   Edite o arquivo `.env.local` com as configurações necessárias.

3. Execute o servidor de desenvolvimento:
   ```
   npm run dev
   ```

4. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

## Build para Produção

```
npm run build
npm start
```

## Integração com o Backend

O frontend se comunica com a API REST do backend através do Axios. As chamadas à API estão centralizadas na pasta `/services` para facilitar a manutenção e reutilização.