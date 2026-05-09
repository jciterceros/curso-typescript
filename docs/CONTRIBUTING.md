# 👨‍💻 Guia de Desenvolvimento - Helpdesk API

Padrões, convenções e melhores práticas para desenvolver no projeto.

---

## 📋 Índice

1. [Padrões de Código](#padrões-de-código)
2. [TypeScript](#typescript)
3. [Validação com Zod](#validação-com-zod)
4. [Estrutura de Projeto](#estrutura-de-projeto)
5. [Testes](#testes)
6. [Documentação](#documentação)
7. [Checklist de PR](#checklist-de-pr)

---

## 🎯 Padrões de Código

### Nomenclatura

#### Pastas/Módulos

```typescript
// Minúsculas, plural quando apropriado
src/controllers/
src/services/
src/repositories/
src/middlewares/
src/routes/
src/utils/
```

#### Classes e Interfaces

```typescript
// PascalCase
class TicketsController {}
interface Ticket {}
interface CreateTicketDto {}
```

#### Funções e Variáveis

```typescript
// camelCase
function getTicketById(id: string) {}
const ticketData = {};
```

#### Constantes

```typescript
// UPPER_SNAKE_CASE
const DEFAULT_LIMIT = 10;
const MAX_PRIORITY = 5;
```

### Exports

```typescript
// ✅ Padrão do projeto: export default singleton
class TicketsService {
  // ...
}

export default new TicketsService();

// Uso:
import ticketsService from "../services/tickets.service.js";
```

---

## 🔷 TypeScript

### Tipagem Explícita

```typescript
// ✅ Bom
function getTicket(id: string): Ticket | null {
  return repository.findById(id);
}

// ❌ Ruim (tipos implícitos)
function getTicket(id) {
  return repository.findById(id);
}
```

### Express com Tipos

```typescript
// ✅ Padrão do projeto
import type { Request, Response } from "express";

class TicketsController {
  // Sem parâmetros
  index(req: Request, res: Response) {
    // ...
  }

  // Com parâmetros URL
  show(req: Request<{ id: string }>, res: Response) {
    // ...
  }

  // Com body
  store(req: Request<{}, {}, CreateTicketDto>, res: Response) {
    // ...
  }

  // Com query
  list(req: Request<{}, {}, {}, ListQuery>, res: Response) {
    // ...
  }
}
```

### DTOs (Data Transfer Objects)

```typescript
// ✅ Separar types por responsabilidade
export interface Ticket {
  id: string;
  title: string;
  // ... completo
}

export type CreateTicketDto = Omit<Ticket, "id" | "createdAt" | "updatedAt">;
export type UpdateTicketDto = Partial<Pick<Ticket, "title" | "status" | "priority">>;

// Uso:
class TicketsRepository {
  create(data: CreateTicketDto): Ticket {}
  update(id: string, data: UpdateTicketDto): Ticket | null {}
}
```

### Type Guards

```typescript
// ✅ Tipo seguro para erro desconhecido
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

// Uso:
try {
  // ...
} catch (error) {
  res.status(400).json({ error: getErrorMessage(error) });
}
```

### `import type`

```typescript
// ✅ Use para tipos puros (não executáveis)
import type { Request, Response } from "express";
import type { Ticket } from "../domain/ticket.js";

// ❌ Evite para módulos que precisa executar
import express from "express"; // Sem "type"
```

---

## 🔒 Validação com Zod

### Schemas Reutilizáveis

```typescript
// ✅ Definir schemas uma vez
const statusSchema = z.enum(["open", "closed", "in_progress"]);
const prioritySchema = z.number().int().min(1).max(5);

const createTicketSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  status: statusSchema,
  priority: prioritySchema,
  assigneeId: z.string().optional(),
});

// Uso em controller:
class TicketsController {
  store(req: Request, res: Response) {
    try {
      const data = createTicketSchema.parse(req.body);
      // data é 100% tipado e validado
      const result = ticketsService.createTicket(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}
```

### Coerção de Tipos

```typescript
// ✅ Converter string → number automaticamente
const numberSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    return Number(value);
  }
  return value;
}, z.number().int().min(1).max(5));

// Uso em query parsing:
const listSchema = z.object({
  priority: numberSchema.optional(),
  page: numberSchema.optional(),
});

// Query: ?priority=3 → prioridade é number(3), não "3"
```

### Validação Condicional

```typescript
// ✅ Validar com condicional
const updateSchema = z
  .object({
    title: z.string().min(3).optional(),
    status: statusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" });
```

---

## 📁 Estrutura de Projeto

### Padrão por Camada

```
src/
├── domain/
│   └── ticket.ts                 # Tipos + DTOs
│
├── repositories/
│   └── tickets.repository.ts     # Persistência
│
├── services/
│   └── tickets.service.ts        # Lógica de negócio
│
├── controllers/
│   └── tickets.controller.ts     # HTTP + Validação
│
├── routes/
│   └── tickets.routes.ts         # Definição de rotas
│
├── middlewares/
│   └── error.middleware.ts       # Tratamento global
│
├── utils/
│   └── id.ts                     # Utilitários
│
└── app.ts                        # Express setup
```

### Dependências (Fluxo Unidirecional)

```
Controllers
     ↓
Services
     ↓
Repositories
     ↓
Domain
```

⚠️ **Nunca use imports "para cima"!** Ex: Repository não deve importar Service.

---

## 🧪 Testes

### Estrutura de Teste

```typescript
import request from "supertest";
import { spawn } from "node:child_process";

describe("Tickets", () => {
  let api;
  let server;

  beforeEach(async () => {
    // Setup: iniciar servidor
    server = spawn(process.execPath, ["--import", "tsx", "src/app.ts"]);
    api = request(`http://127.0.0.1:${PORT}`);
  });

  afterEach(() => {
    server.kill();
  });

  it("should list tickets", async () => {
    const response = await api.get("/tickets");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should return 404 for invalid ticket", async () => {
    const response = await api.get("/tickets/invalid-id");
    expect(response.status).toBe(404);
  });
});
```

### Rodar Testes

```bash
# Todos
npm test

# Específico
npm test -- tests/api.final.test.js

# Watch mode
npm test -- --watch
```

---

## 📚 Documentação

### Comentários em Código

```typescript
// ✅ Comentar POR QUÊ, não O QUÊ

// ❌ Ruim (óbvio demais)
// Incrementar contador
counter++;

// ✅ Bom (explica razão)
// Incrementar contador pois necessário para paginação
counter++;

// ✅ Explicar lógica complexa
// Usar Zod preprocessing porque query params vêm como string
const numberSchema = z.preprocess((value) => Number(value), z.number());
```

### JSDoc

```typescript
/**
 * Cria novo ticket com validação
 *
 * @param ticketData - Dados do ticket (title, description, status, priority)
 * @returns Ticket criado com ID gerado
 * @throws {Error} Se dados inválidos
 */
function createTicket(ticketData: CreateTicketDto): Ticket {
  // ...
}
```

---

## ✅ Checklist de PR (Pull Request)

- [ ] Código segue padrões TypeScript (`strict: true`)
- [ ] Novos endpoints incluem validação com Zod
- [ ] Erros são tratados com `getErrorMessage()`
- [ ] Testes passam (`npm test`)
- [ ] Build sucede (`npm run build`)
- [ ] Imports include extensão `.js`
- [ ] Nenhum `any` sem bom motivo
- [ ] Documentação atualizada (README, ADR, fluxos)
- [ ] Sem `console.log` em produção (use para debug)
- [ ] DTOs separados para criar/atualizar

---

## 🔄 Fluxo de Desenvolvimento

### 1. Feature nova

```bash
# Atualizar tipo no domain/
# → Criar repository
# → Criar service (lógica)
# → Criar controller (HTTP)
# → Definir rotas
# → Registrar em app.ts
# → Testar com npm test
```

### 2. Corrigir bug

```bash
# Escrever teste que reproduz bug
# → Executar `npm test` (deve falhar)
# → Corrigir código
# → Executar `npm test` (deve passar)
# → Verificar build
```

### 3. Refatorar código

```bash
# Refatorar mantendo testes passando
# → npm test (sempre verde)
# → npm run build (sem erros TypeScript)
```

---

## 📊 Métricas de Qualidade

### TypeScript

- ✅ Strict mode ativo
- ✅ Sem `any`
- ✅ Sem `!` (non-null assertion) desnecessário

### Código

- ✅ Nomes descritivos (função → responsabilidade clara)
- ✅ Funções pequenas (< 20 linhas)
- ✅ Tratamento de erro em todo lugar

### Testes

- ✅ 11/11 testes passando
- ✅ Todos endpoints cobertos

---

## 🚀 Deploy

### Build

```bash
npm run build
```

### Executar

```bash
npm start
```

### Variáveis de Ambiente

```bash
PORT=3000          # Default: 3000
NODE_ENV=production
```

---

## 🤔 Perguntas Frequentes

**P: Por que classes ao invés de funções?**  
R: Padrão consistente do projeto. Express controllers usam classes, services e repositories também.

**P: Por que não usar async/await em tudo?**  
R: Dados em memória não precisam ser async. Apenas para I/O real (DB, API).

**P: Como adicionar novo middleware?**  
R: Criar em `src/middlewares/`, depois usar em `app.ts`: `app.use(middleware)`.

**P: Posso usar bibliotecas diferentes?**  
R: Converse com a equipe. Express, Zod e TypeScript são core. Outras devem ser justificadas.

---

## 📞 Contato

Dúvidas? Consulte:

- [Arquitetura em Camadas](../adr/0001-arquitetura-em-camadas.md)
- [Fluxos de Negócio](../fluxos/README.md)
- [Quick Start](./QUICKSTART.md)
