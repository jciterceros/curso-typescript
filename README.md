# Helpdesk API

API REST simples desenvolvida em Node.js e Express para gerenciamento de tickets de suporte tecnico. A aplicacao usa persistencia em memoria, entao os dados voltam ao estado inicial sempre que o servidor e reiniciado.

## Como rodar

### Usando os atalhos do projeto

Use os atalhos da raiz do projeto:

```bat
iniciar-dev.bat
```

ou:

```bat
abrir-cmd-node.bat
npm run dev
```

### Usando Node instalado na maquina

```bash
npm install
npm run dev
```

A API fica disponivel em:

```text
http://localhost:3000
```

## Endpoints

Base URL local:

```text
http://localhost:3000
```

### GET /tickets

Lista tickets cadastrados.

Query params opcionais:

| Parametro | Tipo | Descricao |
| --- | --- | --- |
| `status` | string | Filtra por status exato, por exemplo `open` ou `in_progress`. |
| `priority` | number/string | Filtra por prioridade. A API compara com igualdade flexivel. |
| `limit` | number | Quantidade de tickets por pagina. Padrao: `10`. |
| `page` | number | Pagina desejada. Padrao: `1`. |

Exemplo:

```bash
curl "http://localhost:3000/tickets?limit=5&page=1&status=open"
```

Resposta:

```json
{
  "data": [
    {
      "id": "t1",
      "title": "Erro no login",
      "description": "Nao consigo acessar o sistema com minha senha.",
      "status": "open",
      "priority": 5,
      "assigneeId": "u1",
      "createdAt": "2026-04-27T00:00:00.000Z",
      "updatedAt": "2026-04-27T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### GET /tickets/:id

Busca um ticket por ID e inclui os comentarios relacionados.

Path params:

| Parametro | Tipo | Descricao |
| --- | --- | --- |
| `id` | string | ID do ticket, por exemplo `t1`. |

Exemplo:

```bash
curl "http://localhost:3000/tickets/t1"
```

Resposta `200`:

```json
{
  "id": "t1",
  "title": "Erro no login",
  "description": "Nao consigo acessar o sistema com minha senha.",
  "status": "open",
  "priority": 5,
  "assigneeId": "u1",
  "createdAt": "2026-04-27T00:00:00.000Z",
  "updatedAt": "2026-04-27T00:00:00.000Z",
  "comments": [
    {
      "id": "c1",
      "ticketId": "t1",
      "authorId": "u2",
      "message": "Ja estamos verificando o servidor de autenticacao.",
      "createdAt": "2026-04-27T00:00:00.000Z"
    }
  ]
}
```

Resposta `404`:

```json
{
  "error": "Ticket not found"
}
```

### GET /tickets/:id/summary

Retorna um resumo do ticket.

Path params:

| Parametro | Tipo | Descricao |
| --- | --- | --- |
| `id` | string | ID do ticket, por exemplo `t1`. |

Exemplo:

```bash
curl "http://localhost:3000/tickets/t1/summary"
```

Resposta `200`:

```json
{
  "title": "Erro no login",
  "assigned_to": "u1",
  "created": "27/04/2026"
}
```

Observacao: o campo `short_desc` existe no codigo, mas hoje sai como `undefined`, porque o service usa `ticket.desc` enquanto os tickets possuem `description`.

Resposta `404`:

```json
{
  "error": "Ticket not found"
}
```

### POST /tickets

Cria um ticket.

Body JSON:

| Campo | Tipo | Obrigatorio | Descricao |
| --- | --- | --- | --- |
| `title` | string | Recomendado | Titulo do ticket. |
| `description` | string | Recomendado | Descricao do problema. |
| `status` | string | Recomendado | Status inicial, por exemplo `open`. |
| `priority` | number/string | Recomendado | Prioridade do ticket. |
| `assigneeId` | string | Recomendado | ID do usuario responsavel. |

Exemplo:

```bash
curl -X POST "http://localhost:3000/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Erro no acesso ao sistema",
    "description": "Usuario nao consegue realizar login apos atualizacao",
    "status": "open",
    "priority": 2,
    "assigneeId": "u1"
  }'
```

Resposta `201`:

```json
{
  "ticket": {
    "id": "abc123",
    "title": "Erro no acesso ao sistema",
    "description": "Usuario nao consegue realizar login apos atualizacao",
    "status": "open",
    "priority": 2,
    "assigneeId": "u1",
    "createdAt": "2026-04-27T00:00:00.000Z",
    "updatedAt": "2026-04-27T00:00:00.000Z"
  }
}
```

### PATCH /tickets/:id

Atualiza parcialmente um ticket existente.

Path params:

| Parametro | Tipo | Descricao |
| --- | --- | --- |
| `id` | string | ID do ticket, por exemplo `t1`. |

Body JSON:

Envie apenas os campos que deseja alterar, por exemplo `title`, `description`, `status`, `priority` ou `assigneeId`.

Exemplo:

```bash
curl -X PATCH "http://localhost:3000/tickets/t1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

Resposta `200`:

```json
{
  "id": "t1",
  "title": "Erro no login",
  "description": "Nao consigo acessar o sistema com minha senha.",
  "status": "in_progress",
  "priority": 5,
  "assigneeId": "u1",
  "createdAt": "2026-04-27T00:00:00.000Z",
  "updatedAt": "2026-04-27T00:00:00.000Z"
}
```

Resposta `404`:

```json
{
  "error": "Ticket not found"
}
```

### POST /tickets/:id/comments

Adiciona um comentario a um ticket.

Path params:

| Parametro | Tipo | Descricao |
| --- | --- | --- |
| `id` | string | ID do ticket, por exemplo `t1`. |

Body JSON:

| Campo | Tipo | Obrigatorio | Descricao |
| --- | --- | --- | --- |
| `authorId` | string | Recomendado | ID do usuario que comentou. |
| `message` | string | Recomendado | Texto do comentario. |

Exemplo:

```bash
curl -X POST "http://localhost:3000/tickets/t1/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "u2",
    "message": "Estamos analisando o problema."
  }'
```

Resposta `201`:

```json
{
  "id": "abc123",
  "ticketId": "t1",
  "authorId": "u2",
  "message": "Estamos analisando o problema.",
  "createdAt": "2026-04-27T00:00:00.000Z"
}
```

Resposta `404`:

```json
{
  "error": "Ticket not found"
}
```

### GET /users

Lista usuarios cadastrados.

Exemplo:

```bash
curl "http://localhost:3000/users"
```

Resposta `200`:

```json
[
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
```

## Testes automatizados

Para validar o contrato final esperado depois da migracao para TypeScript, rode:

```bat
npm test
```

A suite usa Vitest e Supertest para testar a API Express sem precisar iniciar o servidor em `localhost:3000`.

Esses testes substituem os scripts manuais antigos da pasta `scripts/`. Eles verificam os principais criterios do roteiro de migracao: payload valido e invalido, filtros por query params, conversao de `priority`, tratamento de `404`, resumo do ticket, `PATCH` com campos permitidos e comentarios.
