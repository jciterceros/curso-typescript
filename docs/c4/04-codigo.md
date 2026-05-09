# Nível 4 - Código (visão estática detalhada)

## Objetivo deste nível
Registrar, em termos de estrutura de código, os principais módulos e contratos de chamada do projeto.

## Módulo de entrada

### `app`
Responsável por:
- criar a instância Express
- registrar `express.json()`
- montar rotas de tickets e users
- registrar middleware global de erro
- iniciar `listen` na porta configurada

## Módulos HTTP

### `tickets.routes` e `users.routes`
Declaram o mapa de endpoints e delegam para controllers.

### `tickets.controller`
Métodos de endpoint:
- `index(req, res)`
- `show(req, res)`
- `summary(req, res)`
- `store(req, res)`
- `update(req, res)`
- `addComment(req, res)`

### `users.controller`
Método de endpoint:
- `index(req, res)`

## Módulo de negócio

### `tickets.service`
Operações centrais:
- `listTickets(filters)`
- `getTicketById(id)`
- `getTicketSummary(id)`
- `createTicket(ticketData)`
- `updateTicket(id, updateData)`
- `addComment(ticketId, commentData)`

## Módulos de dados

### `tickets.repository`
Operações:
- `findAll()`
- `findById(id)`
- `create(data)`
- `update(id, data)`

### `comments.repository`
Operações:
- `findByTicketId(ticketId)`
- `create(data)`

### `users.repository`
Operações:
- `findAll()`
- `findById(id)`

## Utilitário transversal

### `id` utility
- `generateId()` para criação de identificadores simples.

## Encadeamento principal de chamadas
1. Route recebe requisição.
2. Controller valida o mínimo necessário e delega.
3. Service aplica regra de negócio.
4. Repository lê/escreve no armazenamento em memória.
5. Resultado retorna para controller montar resposta HTTP.

## Encadeamento de erro
- Erros previstos são tratados no controller com status específicos (`400`, `404`).
- Erros não previstos podem chegar ao middleware global, retornando `500`.
