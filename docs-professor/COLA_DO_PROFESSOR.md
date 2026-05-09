# COLA_DO_PROFESSOR: roteiro de migração

Este documento é um roteiro prático para conduzir a migração da API de JavaScript para TypeScript ao longo das 4 aulas de 2 horas.

Use este guia junto com o [plano de aula](./plano_de_aula.md). O plano explica a intenção pedagógica; este guia explica o que fazer em sala, em qual ordem, quais arquivos tocar e quais bugs usar como exemplos.

---

## Visão geral da migração

### Objetivo didático

Levar a turma a perceber, na prática, que TypeScript não é apenas "colocar tipo", mas criar contratos mais claros entre entrada da API, controller, service, repository e resposta HTTP.

### Resultado mínimo esperado ao final

Ao final das 4 aulas, a turma deve ter migrado ou acompanhado a migração de:

- setup básico de TypeScript no projeto Express;
- tipos principais do domínio (`Ticket`, `User`, `Comment`, DTOs e status);
- pelo menos 1 endpoint completo, preferencialmente `POST /tickets`;
- validação de payload com Zod;
- tratamento de pelo menos 2 bugs intencionais;
- uma comparação clara entre o comportamento JS antes e o comportamento TS depois.

### Estratégia de ritmo

Priorize sempre:

1. Fazer o projeto rodar.
2. Mostrar um problema real no JavaScript.
3. Aplicar TypeScript para explicitar/corrigir esse problema.
4. Testar no Bruno ou via script.
5. Só então avançar para refinamentos.

Se houver atraso, corte primeiro os bônus. Depois reduza `GET /tickets` com query params. Não corte o endpoint `POST /tickets` com validação, porque ele é o coração do curso.

### Leitura rápida dos tempos

Cada aula tem 2 horas nominais. Os tempos abaixo separam o tempo de cada parte e deixam uma margem pequena para chegada, dúvidas, troca de contexto, execução de comandos e fechamento.

- Aula 1: 95 min de condução + 25 min de margem/checkpoint.
- Aula 2: 90 min de condução + 30 min de margem/checkpoint.
- Aula 3: 100 min de condução + 20 min de margem/checkpoint.
- Aula 4: 95 min de condução + 25 min de margem/checkpoint.

---

## Preparação antes da primeira aula

### Conferir projeto-base

Na raiz do projeto, rode:

```bash
npm install
npm run dev
```

Teste os endpoints principais:

```bash
GET http://localhost:3000/tickets
GET http://localhost:3000/tickets/t1
POST http://localhost:3000/tickets
PATCH http://localhost:3000/tickets/t1
POST http://localhost:3000/tickets/t1/comments
GET http://localhost:3000/users
```

### Separar checkpoints recomendados

Se possível, prepare branches ou cópias por etapa:

- `base-js`: projeto inicial em JavaScript;
- `aula-1-setup-ts`: TypeScript instalado e build funcionando;
- `aula-2-domain-types`: tipos de domínio criados;
- `aula-3-post-ticket-zod`: `POST /tickets` tipado e validado;
- `aula-4-query-errors`: filtros, unions e tratamento de erro;
- `final-ts`: versão final de referência.

Esses checkpoints são plano B para problemas de ambiente ou atrasos.

### Materiais de apoio

Tenha pronto:

- coleção do Bruno com requests por aula;
- exemplos de payload válido e inválido;
- comandos principais em um arquivo ou slide;
- versão final do código para consulta;
- plano B sem instalação, usando o projeto já preparado.

---

## Aula 1: contexto, setup e primeiro contato com TypeScript

### Tempo sugerido da aula 1

- Parte 1: 20 min.
- Parte 2: 20 min.
- Parte 3: 20 min.
- Parte 4: 15 min.
- Parte 5: 20 min.
- Checkpoint, dúvidas e plano B: 25 min.

### Objetivo da aula

Fazer a turma entender por que a migração existe, rodar a API em JS, instalar/configurar TypeScript e ver os primeiros erros sem tentar resolver tudo ainda.

### Parte 1: mostrar a API em JavaScript ESM (20 min)

Comece rodando:

```bash
npm run dev
```

Mostre no Bruno:

- `GET /tickets`;
- `POST /tickets`;
- `PATCH /tickets/:id`;
- `GET /tickets?limit=5&page=1&status=open`.

Antes de entrar em TypeScript, aponte rapidamente que o projeto-base já usa ES Modules:

- `package.json` com `"type": "module"`;
- arquivos usando `import`/`export`;
- imports locais com extensão `.js`, como `./routes/tickets.routes.js`.

Explique que isso deixa o caminho para TypeScript mais parecido com Node moderno. A pegadinha prática é que, com `module: "NodeNext"`, os imports locais continuam escritos com `.js` mesmo quando o arquivo fonte vira `.ts`, porque esse será o nome gerado no `dist`.

### Demonstrações rápidas de problema

Use payloads propositalmente ruins:

```json
{
  "title": "Erro no acesso",
  "description": "Usuário não consegue entrar",
  "status": "closedd",
  "priority": "2",
  "assigneeId": "u1"
}
```

Mostre que o JS aceita:

- `status` errado;
- `priority` como string;
- campos extras no `PATCH`;
- payload incompleto dependendo do caso.

Não corrija ainda. A intenção é criar a pergunta: "como a gente evita esse tipo de contrato frouxo?"

### Parte 2: instalar dependências de TypeScript (20 min)

Instale:

```bash
npm install -D typescript @types/node @types/express tsx
```

Se for usar Zod já instalado nesta aula, instale também:

```bash
npm install zod
```

Caso queira deixar Zod para a aula 3, tudo bem.

### Parte 3: criar `tsconfig.json` (20 min)

Crie um `tsconfig.json` simples:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "allowJs": true,
    "checkJs": false,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Use `allowJs: true` no começo para permitir migração gradual: a turma pode renomear um arquivo por vez para `.ts` enquanto o restante ainda está em `.js`. Mais perto do final, quando tudo estiver migrado, dá para remover `allowJs` como refinamento.

### Parte 4: atualizar scripts (15 min)

No `package.json`, substitua ou acrescente:

```json
{
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js"
  }
}
```

### Parte 5: primeira migração mínima (20 min)

Renomeie apenas o arquivo de entrada:

```txt
src/app.js -> src/app.ts
```

Depois rode:

```bash
npm run build
```

É esperado aparecerem erros ou alertas conforme os imports/ESM. Use isso para explicar:

- erro de TypeScript não é inimigo;
- o compilador mostra onde o contrato está nebuloso;
- em Node ESM/NodeNext, imports relativos devem apontar para `.js`, mesmo quando o arquivo fonte é `.ts`;
- migração incremental significa corrigir por partes.

### Checkpoint da aula 1

Ao final, a turma deve ter:

- API original compreendida;
- TypeScript instalado;
- `tsconfig.json` criado;
- script de build configurado;
- primeiro arquivo `.ts`;
- regra de imports ESM/NodeNext entendida;
- visão clara de que os erros serão usados como guia.

### Plano B

Se o setup atrasar, entregue ou abra o checkpoint `aula-1-setup-ts` e siga a explicação a partir dele.

---

## Aula 2: tipos de domínio e contratos entre camadas

### Tempo sugerido da aula 2

- Parte 1: 15 min.
- Parte 2: 25 min.
- Parte 3: 25 min.
- Parte 4: 15 min.
- Parte 5: 10 min.
- Checkpoint, dúvidas e plano B: 30 min.

### Objetivo da aula

Criar os tipos principais da aplicação e começar a transformar dados soltos em contratos explícitos.

### Parte 1: retomar bugs visíveis (15 min)

Relembre os problemas:

- `status` aceita qualquer string;
- `priority` mistura `number` e `string`;
- repository e service não dizem claramente o que retornam;
- `ticket.desc` existe no código, mas não no dado real.

### Parte 2: criar pasta de domínio (25 min)

Crie:

```txt
src/domain/
  ticket.ts
  user.ts
  comment.ts
```

Em `src/domain/ticket.ts`:

```ts
export type TicketStatus = "open" | "in_progress" | "closed";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: number;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTicketDTO = {
  title: string;
  description: string;
  status?: TicketStatus;
  priority: number;
  assigneeId?: string;
};

export type UpdateTicketDTO = Partial<
  Pick<Ticket, "title" | "description" | "status" | "priority" | "assigneeId">
>;
```

Em `src/domain/user.ts`:

```ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

Em `src/domain/comment.ts`:

```ts
export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  message: string;
  createdAt: Date;
}
```

### Parte 3: migrar repositories gradualmente (25 min)

Comece por:

```txt
src/repositories/tickets.repository.js -> src/repositories/tickets.repository.ts
```

Ajuste o array inicial para ser `Ticket[]`.

Use este momento para corrigir o bug da prioridade inicial:

Antes:

```js
priority: "3";
```

Depois:

```ts
priority: 3;
```

Explique que isso não resolve entrada externa ainda. Só resolve o dado interno conhecido.

### Parte 4: padronizar retorno de busca (15 min)

No repository, deixe claro:

```ts
findById(id: string): Ticket | null
```

Use isso para mostrar `strictNullChecks`: antes de acessar propriedades, o service/controller precisa tratar `null`.

### Parte 5: evidenciar typo com `ticket.desc` (10 min)

Ao tipar `getTicketSummary`, o TypeScript deve reclamar de:

```ts
ticket.desc;
```

Corrija para:

```ts
ticket.description;
```

Esse é um dos melhores momentos pedagógicos do curso: um bug silencioso em JS vira erro claro em TS.

### Checkpoint da aula 2

Ao final, a turma deve ter:

- tipos de domínio criados;
- `TicketStatus` como union;
- `priority` padronizada internamente como `number`;
- pelo menos repository/service parcialmente tipados;
- um bug real corrigido por erro de compilação.

### Plano B

Se a turma estiver lenta, faça apenas `Ticket` e `tickets.repository.ts`. Deixe `User` e `Comment` como demonstração rápida ou para checkpoint pronto.

---

## Aula 3: endpoint principal e validação com Zod

### Tempo sugerido da aula 3

- Parte 1: 10 min.
- Parte 2: 25 min.
- Parte 3: 10 min.
- Parte 4: 20 min.
- Parte 5: 20 min.
- Parte 6: 15 min.
- Checkpoint, dúvidas e plano B: 20 min.

### Objetivo da aula

Migrar o fluxo completo de criação de ticket e mostrar a diferença entre tipo em tempo de desenvolvimento e validação em runtime.

### Parte 1: escolher o fluxo principal (10 min)

Use o endpoint:

```txt
POST /tickets
```

Ele passa por:

```txt
route -> controller -> service -> repository
```

Isso deixa clara a ideia de contrato entre camadas.

### Parte 2: migrar controller e service (25 min)

Renomeie:

```txt
src/controllers/tickets.controller.js -> src/controllers/tickets.controller.ts
src/services/tickets.service.js -> src/services/tickets.service.ts
```

Tipar o service primeiro costuma ser mais didático:

```ts
createTicket(ticketData: CreateTicketDTO): { ticket: Ticket } {
  const ticket = ticketsRepository.create(ticketData);
  return { ticket };
}
```

Depois mostre que a controller ainda passa `req.body`, que no Express tende a escapar como `any`.

### Parte 3: explicar `any` vs `unknown` (10 min)

Use uma explicação curta:

- `any`: "confia em mim, compilador";
- `unknown`: "eu ainda não sei o que é; preciso verificar antes".

Mostre que entrada HTTP não deve ser confiada só porque o TypeScript existe.

### Parte 4: criar schemas com Zod (20 min)

Crie:

```txt
src/schemas/
  ticket.schema.ts
```

Conteúdo sugerido:

```ts
import { z } from "zod";

export const ticketStatusSchema = z.enum(["open", "in_progress", "closed"]);

export const createTicketSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  status: ticketStatusSchema.default("open"),
  priority: z.coerce.number().int().min(1).max(5),
  assigneeId: z.string().optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
```

### Parte 5: validar `req.body` na controller (20 min)

Na controller:

```ts
const data = createTicketSchema.parse(req.body);
const result = ticketsService.createTicket(data);
```

Trate erro de validação de forma simples. Para aula introdutória, pode ser:

```ts
try {
  const data = createTicketSchema.parse(req.body);
  const result = ticketsService.createTicket(data);
  res.status(201).json(result);
} catch (error) {
  res.status(400).json({ error: "Invalid payload" });
}
```

Se quiser mostrar mais detalhe, use `ZodError`, mas não deixe isso roubar a aula.

### Parte 6: testar no Bruno (15 min)

Teste payload válido:

```json
{
  "title": "Erro no login",
  "description": "Usuário não consegue acessar",
  "status": "open",
  "priority": "2",
  "assigneeId": "u1"
}
```

Teste payload inválido:

```json
{
  "title": "Oi",
  "description": "x",
  "status": "closedd",
  "priority": "alta"
}
```

Mostre:

- TypeScript protege o código que escrevemos;
- Zod protege a entrada que vem de fora;
- `z.infer` evita duplicar tipo manualmente.

### Checkpoint da aula 3

Ao final, a turma deve ter:

- `POST /tickets` migrado;
- schema de criação com Zod;
- payload inválido barrado em runtime;
- tipo inferido pelo schema;
- comparação clara entre `req.body` solto e entrada validada.

### Plano B

Se estiver apertado, valide apenas `title`, `description` e `priority`. Deixe `status` e `assigneeId` para ajuste rápido no começo da aula 4.

---

## Aula 4: unions, narrowing, query params e fechamento

### Tempo sugerido da aula 4

- Parte 1: 30 min.
- Parte 2: 30 min.
- Parte 3: 15 min.
- Parte 4: 20 min.
- Checkpoint final, dúvidas e próximos passos: 25 min.

### Objetivo da aula

Consolidar os conceitos, mostrar tratamento tipado de estados/erros e, se houver ritmo, migrar a listagem com filtros.

### Parte 1: retorno de service com union (30 min)

Introduza uma union simples:

```ts
type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string; statusCode: number };
```

Use em um método como `getTicketById` ou `updateTicket`.

Exemplo:

```ts
getTicketById(id: string): ServiceResult<Ticket> {
  const ticket = ticketsRepository.findById(id);

  if (!ticket) {
    return { ok: false, error: 'Ticket not found', statusCode: 404 };
  }

  return { ok: true, data: ticket };
}
```

Na controller:

```ts
const result = ticketsService.getTicketById(req.params.id);

if (!result.ok) {
  return res.status(result.statusCode).json({ error: result.error });
}

return res.json(result.data);
```

Mostre o narrowing: depois do `if (!result.ok)`, o TypeScript sabe que `result.data` existe.

### Parte 2: query params com Zod (30 min)

Se houver tempo, migre:

```txt
GET /tickets
```

No schema:

```ts
export const listTicketsQuerySchema = z.object({
  status: ticketStatusSchema.optional(),
  priority: z.coerce.number().int().min(1).max(5).optional(),
  limit: z.coerce.number().int().positive().default(10),
  page: z.coerce.number().int().positive().default(1),
});

export type ListTicketsQuery = z.infer<typeof listTicketsQuerySchema>;
```

No service:

```ts
listTickets(filters: ListTicketsQuery)
```

Corrija comparações frouxas:

Antes:

```js
t.priority == priority;
```

Depois:

```ts
t.priority === priority;
```

Explique que a validação remove a necessidade de coerção implícita.

### Parte 3: PATCH permissivo (15 min)

Se houver tempo, crie `updateTicketSchema`:

```ts
export const updateTicketSchema = createTicketSchema.partial();
```

Ou, para ser mais controlado:

```ts
export const updateTicketSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  status: ticketStatusSchema.optional(),
  priority: z.coerce.number().int().min(1).max(5).optional(),
  assigneeId: z.string().optional(),
});
```

Mostre que campos como `id`, `createdAt` e `foo` não devem passar para a camada de dados.

### Parte 4: fechamento antes/depois (20 min)

Faça uma revisão curta:

- JS aceitava `status: "closedd"`; TS/Zod bloqueiam.
- JS misturava `priority: "3"` e `priority: 3`; agora o contrato é `number`.
- JS acessava `ticket.desc`; TS encontrou o erro.
- JS passava `req.body` direto; agora há schema.
- JS dependia de coerção em query params; agora há conversão explícita.
- Service pode retornar union `ok/error`, facilitando narrowing.

### Checkpoint final

Ao final da aula 4, o projeto idealmente deve ter:

- domínio tipado;
- endpoint principal validado;
- pelo menos uma busca ou atualização com retorno seguro;
- alguns bugs intencionais corrigidos;
- turma entendendo a estratégia de migração incremental.

### Bônus

Só se sobrar tempo:

- criar `GET /tickets/:id/timeline`;
- padronizar middleware de erro;
- ativar regras mais rigorosas no `tsconfig`;
- falar sobre testes, ORM e frameworks como próximos passos.

---

## Mapa dos bugs intencionais

### Bug 1: status permissivo

**Onde aparece:** `POST /tickets`, `PATCH /tickets/:id`, repository.

**Problema:** qualquer string é aceita, inclusive `"closedd"`.

**Correção didática:** `TicketStatus` como union e `z.enum(...)` no schema.

**Melhor aula para abordar:** aula 2 para tipo; aula 3 para validação de entrada.

### Bug 2: priority híbrida

**Onde aparece:** seed do repository e entrada da API.

**Problema:** `priority` pode virar `number` ou `string`.

**Correção didática:** `priority: number` no domínio e `z.coerce.number()` no schema.

**Melhor aula para abordar:** aula 2 internamente; aula 3 em payload.

### Bug 3: query params sem conversão

**Onde aparece:** `listTickets(filters)`.

**Problema:** `limit`, `page` e `priority` chegam como string e o JS faz coerção implícita.

**Correção didática:** schema de query com `z.coerce.number()`.

**Melhor aula para abordar:** aula 4.

### Bug 4: retorno inconsistente de busca

**Onde aparece:** repositories e services.

**Problema:** mistura mental entre `null`, `undefined` e objeto encontrado.

**Correção didática:** assinatura explícita `Ticket | null` e tratamento obrigatório antes de acessar propriedades.

**Melhor aula para abordar:** aula 2.

### Bug 5: uso direto de `req.body`

**Onde aparece:** controller.

**Problema:** entrada externa entra como se fosse confiável.

**Correção didática:** schema Zod antes de chamar o service.

**Melhor aula para abordar:** aula 3.

### Bug 6: PATCH permissivo

**Onde aparece:** `Object.assign` ou merge direto no repository.

**Problema:** usuário pode tentar alterar `id`, `createdAt` ou adicionar campos inesperados.

**Correção didática:** `UpdateTicketDTO` e `updateTicketSchema`.

**Melhor aula para abordar:** aula 4 ou bônus.

### Bug 7: ID tratado como número

**Onde aparece:** `parseInt(id)` no repository.

**Problema:** o domínio usa ID string, mas o código sugere número.

**Correção didática:** `id: string` em todas as camadas e remoção da coerção.

**Melhor aula para abordar:** aula 2.

### Bug 8: formatos de retorno variados

**Onde aparece:** service retorna `{ data }`, `{ ticket }` ou objeto direto.

**Problema:** a controller precisa decorar formatos diferentes.

**Correção didática:** padronizar retornos ou introduzir `ServiceResult<T>`.

**Melhor aula para abordar:** aula 4.

### Bug 9: propriedade inexistente

**Onde aparece:** `getTicketSummary`, usando `ticket.desc`.

**Problema:** JS retorna `undefined` silenciosamente.

**Correção didática:** tipo `Ticket` com `description`; TS acusa `desc`.

**Melhor aula para abordar:** aula 2.

---

## Ordem recomendada de arquivos

Esta ordem costuma reduzir confusão:

1. `src/app.js` -> `src/app.ts`
2. `src/domain/ticket.ts`
3. `src/domain/user.ts`
4. `src/domain/comment.ts`
5. `src/repositories/tickets.repository.js` -> `.ts`
6. `src/services/tickets.service.js` -> `.ts`
7. `src/controllers/tickets.controller.js` -> `.ts`
8. `src/schemas/ticket.schema.ts`
9. `src/routes/tickets.routes.js` -> `.ts`
10. Demais repositories/controllers/routes conforme sobrar tempo

---

## Comandos úteis para a aula

```bash
npm run dev
npm run build
npm test
node dist/app.js
```

Enquanto o projeto ainda estiver em JavaScript, `npm run dev` usa `node --watch src/app.js`. Depois do setup TypeScript, o roteiro troca para `tsx watch src/app.ts`.

No Windows, se o PowerShell bloquear `npm.ps1`, use `npm.cmd` no mesmo comando:

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd test
```

Se o build falhar, leia o primeiro erro com a turma. Evite tentar corrigir dez erros ao mesmo tempo.

---

## Critério de sucesso do curso

O curso foi bem-sucedido se a turma sair sabendo explicar:

- por que migrar aos poucos;
- onde TypeScript ajuda e onde não substitui validação;
- como modelar uma entidade simples;
- como tipar entrada, retorno e contrato entre camadas;
- como Zod e TypeScript se complementam;
- como um bug silencioso em JS vira feedback antecipado no TS.

Não é necessário que todos os arquivos estejam 100% migrados para o curso cumprir seu objetivo.
