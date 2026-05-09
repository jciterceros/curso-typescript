# Documentação Técnica - Helpdesk API

**Projeto**: API REST para gerenciamento de tickets de suporte  
**Stack**: Node.js 24 | Express 5 | TypeScript 6 | Zod | Vitest  
**Status**: ✅ Migração de JS para TypeScript concluída (100% tipado)

---

## 📚 Índice Completo

### 🏗️ Arquitetura e Design
- **[Modelo C4 (Visão Geral)](./c4/README.md)**
  - [01 - Contexto](./c4/01-contexto.md) - Visão de contexto do sistema
  - [02 - Contêineres](./c4/02-conteineres.md) - Componentes principais
  - [03 - Componentes](./c4/03-componentes.md) - Camadas internas
  - [04 - Código](./c4/04-codigo.md) - Estrutura do código
  - [05 - Ciclo de Requisição](./c4/05-ciclo-requisicao.md) - Fluxo de uma requisição
  - [Modelo C4 Consolidado](./c4/modelo-c4.md) - Visão completa

### 📋 Decisions Records (ADRs)
- **[Índice de ADRs](./adr/README.md)**
  - [ADR-0001: Arquitetura em Camadas](./adr/0001-arquitetura-em-camadas.md)
  - [ADR-0002: Persistência em Memória](./adr/0002-persistencia-em-memoria.md)
  - [ADR-0003: Estratégia de Validação](./adr/0003-estrategia-validacao.md)
  - [ADR-0004: Tratamento de Erros HTTP](./adr/0004-tratamento-de-erros-http.md)

### 🔄 Fluxos de Negócio (Diagramas Mermaid)
- **[Visão Geral](./fluxos/README.md)**
  - [01 - GET /tickets (Listagem)](./fluxos/01-get-tickets.md)
  - [02 - GET /tickets/:id (Detalhe)](./fluxos/02-get-ticket-por-id.md)
  - [03 - GET /tickets/:id/summary (Resumo)](./fluxos/03-get-ticket-summary.md)
  - [04 - POST /tickets (Criação)](./fluxos/04-post-tickets.md)
  - [05 - PATCH /tickets/:id (Atualização)](./fluxos/05-patch-ticket.md)
  - [06 - POST /tickets/:id/comments (Comentário)](./fluxos/06-post-ticket-comment.md)
  - [07 - GET /users (Usuários)](./fluxos/07-get-users.md)
  - [08 - Middleware de Erro Global](./fluxos/08-fluxo-middleware-erro.md)
  - [09 - Inicialização e Ciclo](./fluxos/09-inicializacao-e-ciclo.md)

### 🔄 Migração TypeScript
- **[Migração JS → TypeScript (Concluída)](./migracao-completa.md)**
  - Estrutura final 100% TypeScript
  - Padrões TypeScript implementados
  - Validação com Zod
  - Status de testes (11/11 ✅)
- **[Fase 1 - Baseline](./migracao-fase-1-baseline.md)** - Ponto de partida da migração

---

## 🎯 Escopo Documentado

### Endpoints Implementados (7 rotas)
1. ✅ `GET /tickets` - Listagem com filtros
2. ✅ `POST /tickets` - Criação de ticket
3. ✅ `GET /tickets/:id` - Detalhe com comentários
4. ✅ `GET /tickets/:id/summary` - Resumo simplificado
5. ✅ `PATCH /tickets/:id` - Atualização parcial
6. ✅ `POST /tickets/:id/comments` - Adicionar comentário
7. ✅ `GET /users` - Listagem de usuários

### Fluxos Internos
- ✅ Inicialização e ciclo de requisição
- ✅ Tratamento global de erros
- ✅ Validação com Zod
- ✅ Orquestração de repositórios

---

## 🏢 Estrutura de Camadas

```
┌─────────────────────────────────────────┐
│ HTTP Layer (Controllers + Routes)       │
│ - Express HTTP handling                 │
│ - Zod schema validation                 │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ Business Layer (Services)               │
│ - Tickets service                       │
│ - Business logic & rules                │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ Persistence Layer (Repositories)        │
│ - Tickets repository (in-memory)        │
│ - Comments repository (in-memory)       │
│ - Users repository (in-memory)          │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ Domain Layer (Types & Interfaces)       │
│ - Ticket, User, Comment types           │
│ - DTOs (Create, Update)                 │
└─────────────────────────────────────────┘
```

---

## 📊 Características Principais

### Tipagem TypeScript
- ✅ 100% tipado
- ✅ `Request<T>` e `Response` tipados
- ✅ Tipos genéricos para parâmetros
- ✅ DTOs para APIs
- ✅ `unknown` → type guards seguros

### Validação de Entrada
- ✅ Schemas Zod para todos os endpoints
- ✅ Coerção automática (string → number)
- ✅ Validação de ranges (1-5 para prioridade)
- ✅ Campos opcionais vs obrigatórios
- ✅ Rejeição 400 para payloads inválidos

### Tratamento de Erro
- ✅ Middleware global de erro
- ✅ Stack traces em console
- ✅ HTTP status apropriados (400, 404, 500)
- ✅ Mensagens de erro seguras

### Padrões
- ✅ Arquitetura em camadas
- ✅ Dependency injection (singletons)
- ✅ Schemas reusáveis
- ✅ ESM + TypeScript strict mode

---

## 🚀 Tecnologias

- **Express 5.x** - Web framework
- **TypeScript 6.x** - Type safety
- **Zod 4.x** - Schema validation
- **Vitest 4.x** - Test runner
- **Supertest 7.x** - HTTP testing
- **tsx 4.x** - TypeScript executor

---

## 📈 Progresso da Migração

| Item | Status |
|------|--------|
| Código-fonte | ✅ 100% TypeScript |
| Tipagem | ✅ Strict mode |
| Validação | ✅ Zod implementado |
| Testes | ✅ 11/11 passando |
| Documentação | ✅ Completa |
| Contrato HTTP | ✅ Preservado |

---

## 🔗 Referências Rápidas

**Para entender o projeto:**
1. Comece pelo [Modelo C4 - Contexto](./c4/01-contexto.md)
2. Explore [Fluxos de Negócio](./fluxos/README.md)
3. Consulte [ADRs para decisões](./adr/README.md)

**Para debugar:**
- Veja [Middleware de Erro](./fluxos/08-fluxo-middleware-erro.md)
- Consulte [Ciclo de Requisição](./c4/05-ciclo-requisicao.md)

**Para entender padrões:**
- [ADR-0001: Arquitetura em Camadas](./adr/0001-arquitetura-em-camadas.md)
- [ADR-0003: Estratégia de Validação](./adr/0003-estrategia-validacao.md)
