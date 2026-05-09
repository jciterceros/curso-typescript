# Referência da API - Helpdesk

Documentação completa de todos os endpoints disponíveis.

## Base URL

```
http://localhost:3000
```

---

## 📋 Tickets

### GET /tickets

**Listagem de tickets com filtros e paginação**

**Query Parameters:**

```
status?: 'open' | 'closed' | 'in_progress'
priority?: 1 | 2 | 3 | 4 | 5
limit?: number (default: 10, min: 1)
page?: number (default: 1, min: 1)
```

**Exemplo de Requisição:**

```bash
curl "http://localhost:3000/tickets?status=open&priority=1&limit=5&page=1"
```

**Exemplo de Resposta (200 OK):**

```json
{
  "data": [
    {
      "id": "t1",
      "title": "Erro no login",
      "description": "Não consigo acessar o sistema",
      "status": "open",
      "priority": 5,
      "assigneeId": "u1",
      "createdAt": "2026-05-08T10:00:00.000Z",
      "updatedAt": "2026-05-08T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

**Erros:**

- `400 Bad Request` - Query parameters inválidos

---

### POST /tickets

**Criar novo ticket**

**Request Body:**

```json
{
  "title": "string (min 3 chars)",
  "description": "string (min 3 chars)",
  "status": "open" | "closed" | "in_progress",
  "priority": 1 | 2 | 3 | 4 | 5,
  "assigneeId": "string (optional)"
}
```

**Exemplo de Requisição:**

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Falha na impressora",
    "description": "Impressora não conecta à rede",
    "status": "open",
    "priority": 3,
    "assigneeId": "u2"
  }'
```

**Exemplo de Resposta (201 Created):**

```json
{
  "data": {
    "id": "t3",
    "title": "Falha na impressora",
    "description": "Impressora não conecta à rede",
    "status": "open",
    "priority": 3,
    "assigneeId": "u2",
    "createdAt": "2026-05-08T10:30:00.000Z",
    "updatedAt": "2026-05-08T10:30:00.000Z"
  }
}
```

**Erros:**

- `400 Bad Request` - Body inválido ou campos faltando

---

### GET /tickets/:id

**Obter ticket detalhado com comentários**

**Path Parameters:**

- `id` (string) - ID do ticket

**Exemplo de Requisição:**

```bash
curl http://localhost:3000/tickets/t1
```

**Exemplo de Resposta (200 OK):**

```json
{
  "data": {
    "id": "t1",
    "title": "Erro no login",
    "description": "Não consigo acessar o sistema",
    "status": "open",
    "priority": 5,
    "assigneeId": "u1",
    "createdAt": "2026-05-08T10:00:00.000Z",
    "updatedAt": "2026-05-08T10:00:00.000Z",
    "comments": [
      {
        "id": "c1",
        "ticketId": "t1",
        "authorId": "u1",
        "message": "Tentei resetar a senha",
        "createdAt": "2026-05-08T10:15:00.000Z"
      }
    ]
  }
}
```

**Erros:**

- `404 Not Found` - Ticket não existe

---

### GET /tickets/:id/summary

**Obter resumo simplificado do ticket**

**Path Parameters:**

- `id` (string) - ID do ticket

**Exemplo de Requisição:**

```bash
curl http://localhost:3000/tickets/t1/summary
```

**Exemplo de Resposta (200 OK):**

```json
{
  "data": {
    "title": "Erro no login",
    "shortDesc": "Não consigo acessar o sistema",
    "assignedTo": "u1",
    "created": "2026-05-08T10:00:00.000Z"
  }
}
```

**Erros:**

- `404 Not Found` - Ticket não existe

---

### PATCH /tickets/:id

**Atualizar ticket (campos parciais)**

**Path Parameters:**

- `id` (string) - ID do ticket

**Request Body (todos os campos opcionais, mas min. 1 obrigatório):**

```json
{
  "title": "string (min 3 chars, optional)",
  "description": "string (min 3 chars, optional)",
  "status": "open" | "closed" | "in_progress" (optional),
  "priority": 1 | 2 | 3 | 4 | 5 (optional),
  "assigneeId": "string (optional)"
}
```

**Exemplo de Requisição:**

```bash
curl -X PATCH http://localhost:3000/tickets/t1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "closed",
    "priority": 1
  }'
```

**Exemplo de Resposta (200 OK):**

```json
{
  "data": {
    "id": "t1",
    "title": "Erro no login",
    "description": "Não consigo acessar o sistema",
    "status": "closed",
    "priority": 1,
    "assigneeId": "u1",
    "createdAt": "2026-05-08T10:00:00.000Z",
    "updatedAt": "2026-05-08T11:00:00.000Z"
  }
}
```

**Erros:**

- `400 Bad Request` - Body vazio ou inválido
- `404 Not Found` - Ticket não existe

---

### POST /tickets/:id/comments

**Adicionar comentário ao ticket**

**Path Parameters:**

- `id` (string) - ID do ticket

**Request Body:**

```json
{
  "authorId": "string (required, min 1 char)",
  "message": "string (required, min 1 char)"
}
```

**Exemplo de Requisição:**

```bash
curl -X POST http://localhost:3000/tickets/t1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "u2",
    "message": "Consegui resolver o problema"
  }'
```

**Exemplo de Resposta (201 Created):**

```json
{
  "data": {
    "id": "c2",
    "ticketId": "t1",
    "authorId": "u2",
    "message": "Consegui resolver o problema",
    "createdAt": "2026-05-08T11:30:00.000Z"
  }
}
```

**Erros:**

- `400 Bad Request` - Body inválido ou campos faltando
- `404 Not Found` - Ticket não existe

---

## 👥 Usuários

### GET /users

**Listar todos os usuários**

**Exemplo de Requisição:**

```bash
curl http://localhost:3000/users
```

**Exemplo de Resposta (200 OK):**

```json
{
  "data": [
    {
      "id": "u1",
      "name": "Alice Suporte",
      "email": "alice@helpdesk.com"
    },
    {
      "id": "u2",
      "name": "Bob Tecnico",
      "email": "bob@helpdesk.com"
    },
    {
      "id": "u3",
      "name": "Charlie Usuario",
      "email": "charlie@gmail.com"
    }
  ]
}
```

---

## 🔴 Tratamento de Erros

Todos os erros seguem envelope padronizado:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem descritiva",
    "details": {}
  }
}
```

**Exemplo (400 Bad Request):**

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request",
    "details": {
      "issues": []
    }
  }
}
```

**Exemplo (404 Not Found):**

```json
{
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "Ticket not found"
  }
}
```

**Exemplo (500 Internal Server Error):**

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Internal Server Error",
    "details": {
      "internalMessage": "Mensagem do erro interno"
    }
  }
}
```

### Códigos de Status HTTP

| Status | Significado                              |
| ------ | ---------------------------------------- |
| `200`  | OK - Requisição bem-sucedida             |
| `201`  | Created - Recurso criado com sucesso     |
| `400`  | Bad Request - Dados inválidos            |
| `404`  | Not Found - Recurso não encontrado       |
| `500`  | Internal Server Error - Erro no servidor |

---

## 🧪 Exemplos Completos (cURL)

### Criar e listar tickets

```bash
# 1. Criar um novo ticket
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Problema no email",
    "description": "Não consigo enviar emails",
    "status": "open",
    "priority": 2,
    "assigneeId": "u1"
  }'

# 2. Listar tickets abertos com prioridade alta
curl "http://localhost:3000/tickets?status=open&priority=1"

# 3. Obter ticket detalhado
curl http://localhost:3000/tickets/t1

# 4. Adicionar comentário
curl -X POST http://localhost:3000/tickets/t1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "u1",
    "message": "Estou investigando o problema"
  }'

# 5. Atualizar status para em progresso
curl -X PATCH http://localhost:3000/tickets/t1 \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'

# 6. Listar usuários
curl http://localhost:3000/users
```

---

## 📝 Dados Iniciais (Seed)

A aplicação inicia com dados pré-carregados:

**Tickets:**

- `t1`: "Erro no login" (open, priority 5) - Alice
- `t2`: "Impressora offline" (in_progress, priority 3) - Bob

**Usuários:**

- `u1`: Alice Suporte (alice@helpdesk.com)
- `u2`: Bob Tecnico (bob@helpdesk.com)
- `u3`: Charlie Usuario (charlie@gmail.com)

⚠️ **Nota**: Dados em memória são resetados quando o servidor reinicia!
