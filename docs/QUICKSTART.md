# 🚀 Quick Start - Helpdesk API

Guia rápido para começar a trabalhar com o projeto.

---

## 📦 Setup Inicial

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar em desenvolvimento

```bash
npm run dev
```

A API estará em: **http://localhost:3000**

### 3. Testar endpoints (em outro terminal)

```bash
# Listar tickets
curl http://localhost:3000/tickets

# Listar usuários
curl http://localhost:3000/users
```

---

## 🏗️ Estrutura do Projeto

```
src/
├── app.ts                    👈 Inicia Express
├── controllers/              👈 HTTP handlers
├── services/                 👈 Regras de negócio
├── repositories/             👈 Persistência (memória)
├── middlewares/              👈 Tratamento de erro
├── routes/                   👈 Definição de rotas
├── domain/                   👈 Tipos TypeScript
└── utils/                    👈 Utilitários
```

---

## 🔄 Fluxo de uma Requisição

```
Cliente HTTP
    ↓
Express Router (routes/)
    ↓
Controller (validação com Zod)
    ↓
Service (lógica de negócio)
    ↓
Repository (acesso aos dados)
    ↓
Database (em memória)
    ↓
Service → Controller → Router → Cliente
    ↓
Error Middleware (se houver erro)
    ↓
Cliente recebe erro formatado
```

---

## 📝 Criar um Novo Endpoint

### Passo 1: Definir tipo no `domain/`

```typescript
// src/domain/exemplo.ts
export interface Exemplo {
  id: string;
  nome: string;
}
```

### Passo 2: Criar repository em `repositories/`

```typescript
// src/repositories/exemplo.repository.ts
import { Exemplo } from "../domain/exemplo.js";

class ExemploRepository {
  private exemplos: Exemplo[] = [];

  findAll(): Exemplo[] {
    return this.exemplos;
  }
}

export default new ExemploRepository();
```

### Passo 3: Criar service em `services/`

```typescript
// src/services/exemplo.service.ts
import exemploRepository from "../repositories/exemplo.repository.js";

class ExemploService {
  listExemplos() {
    return exemploRepository.findAll();
  }
}

export default new ExemploService();
```

### Passo 4: Criar controller em `controllers/`

```typescript
// src/controllers/exemplo.controller.ts
import type { Request, Response } from "express";
import exemploService from "../services/exemplo.service.js";

class ExemploController {
  index(req: Request, res: Response) {
    const exemplos = exemploService.listExemplos();
    res.json(exemplos);
  }
}

export default new ExemploController();
```

### Passo 5: Criar rotas em `routes/`

```typescript
// src/routes/exemplo.routes.ts
import { Router } from "express";
import exemploController from "../controllers/exemplo.controller.js";

const router = Router();

router.get("/", exemploController.index);

export default router;
```

### Passo 6: Registrar rotas em `app.ts`

```typescript
import exemploRoutes from "./routes/exemplo.routes.js";

app.use("/exemplos", exemploRoutes);
```

---

## ✅ Adicionar Validação com Zod

```typescript
// Em controllers/exemplo.controller.ts
import { z } from "zod";

const exemploSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
});

class ExemploController {
  store(req: Request, res: Response) {
    try {
      const data = exemploSchema.parse(req.body);
      // ... resto do código
      res.status(201).json(resultado);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  }
}
```

---

## 🧪 Rodando Testes

```bash
# Rodar todos os testes
npm test

# Rodar teste específico
npm test -- tests/api.final.test.js
```

---

## 🔨 Build para Produção

```bash
# Compilar TypeScript para JavaScript
npm run build

# Executar build compilado
npm start
```

Arquivos compilados ficarão em: `dist/`

---

## 🐛 Debugging

### Ver stack trace de erros

O middleware global já registra erros em console. Veja o terminal onde `npm run dev` está rodando.

### Loggar variáveis

```typescript
console.log("Debug:", variavel);
```

### TypeScript strict mode

O projeto usa `strict: true`. Erros de tipo são detectados na compilação.

---

## 📂 Onde Adicionar Coisas

| Objetivo            | Arquivo                      |
| ------------------- | ---------------------------- |
| Novo tipo/interface | `src/domain/`                |
| Novo endpoint       | `src/routes/` (e controller) |
| Lógica de negócio   | `src/services/`              |
| Acesso a dados      | `src/repositories/`          |
| Tratamento HTTP     | `src/controllers/`           |
| Middleware global   | `src/middlewares/`           |
| Utilitários         | `src/utils/`                 |

---

## 🚨 Erros Comuns

### `ERR_MODULE_NOT_FOUND`

Faltou a extensão `.js` em imports ESM:

```typescript
// ❌ Errado
import exemplo from "../exemplo";

// ✅ Correto
import exemplo from "../exemplo.js";
```

### `Cannot find module or its corresponding type declaration`

Execute `npm run build` ou `npm install` para atualizar tipos.

### `Zod validation error`

Dados enviados não correspondem ao schema. Verifique tipos e formatos.

### Porta 3000 já em uso

```bash
# Rodar em porta diferente
PORT=3001 npm run dev
```

---

## 💡 Dicas

1. **Use TypeScript**: Aproveite a verificação de tipos. Erros aparecem antes de rodar código.

2. **Nomes descritivos**: `getTicketByIdWithComments()` é melhor que `getTicket()`.

3. **Valide tudo**: Use Zod para validar inputs do cliente.

4. **DTOs**: Use tipos específicos para criação/atualização vs consulta.

5. **Imutabilidade**: Não altere objetos diretamente, crie novos:

   ```typescript
   // ❌ Errado
   ticket.status = "closed";

   // ✅ Correto
   const updated = { ...ticket, status: "closed" };
   ```

6. **Tratamento de erro**: Sempre valide e lance erros significativos.

---

## 📚 Próximos Passos

1. Leia [API_REFERENCE.md](./API_REFERENCE.md) para entender todos endpoints
2. Estude [Arquitetura em Camadas](./adr/0001-arquitetura-em-camadas.md)
3. Explore os [Fluxos](./fluxos/README.md) de cada endpoint
4. Veja o [Modelo C4](./c4/README.md) da aplicação

---

## 🆘 Precisa de Ajuda?

- **Erro estranho?** Veja o terminal onde `npm run dev` está rodando
- **TypeScript reclamando?** Use `npm run build` para compilar e ver erros
- **Teste falhando?** Execute `npm test` para ver o que está quebrado
- **Estrutura confusa?** Revise [Arquitetura em Camadas](./adr/0001-arquitetura-em-camadas.md)
