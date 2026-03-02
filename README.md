# Helpdesk API

Uma API REST simples desenvolvida em Node.js e Express para o gerenciamento de tickets de suporte técnico. Esta aplicação utiliza persistência em memória para facilitar o desenvolvimento e testes locais.

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor:
   ```bash
   node src/app.js
   ```

A API estará disponível em `http://localhost:3000`.

## Endpoints Principais

### Tickets

* `GET /tickets` - Listar tickets (suporta filtros por `status`, `priority`, `limit` e `page`)
* `GET /tickets/:id` - Buscar detalhes de um ticket específico por ID
* `POST /tickets` - Registrar um novo ticket de suporte
* `PATCH /tickets/:id` - Atualizar informações de um ticket existente
* `POST /tickets/:id/comments` - Adicionar um comentário a um ticket

### Usuários

* `GET /users` - Listar usuários cadastrados no sistema

## Exemplos de Uso

### 1. Criar um novo ticket
```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Erro no acesso ao sistema",
    "description": "Usuário não consegue realizar login após atualização",
    "status": "open",
    "priority": 2,
    "assigneeId": "u1"
  }'
```

### 2. Atualizar informações de um ticket
```bash
curl -X PATCH http://localhost:3000/tickets/t1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

### 3. Listar tickets com paginação e filtros
```bash
curl "http://localhost:3000/tickets?limit=5&page=1&status=open"
```

## Scripts de Utilidade

A pasta `scripts/` contém rotinas para automatizar testes e interações comuns com a API:

* `node scripts/create-ticket.js`: Executa o fluxo de criação de um novo ticket de teste.
* `node scripts/list-tickets.js`: Realiza a listagem de tickets utilizando parâmetros de busca.
* `node scripts/update-ticket.js`: Testa a atualização de dados em tickets existentes.
* `node scripts/check-consistency.js`: Utilitário para verificação de integridade das respostas da API.
