## Briefing do projeto (base em JavaScript para refatorar depois para TypeScript)

### Objetivo do projeto

Criar uma **API REST simples em Node.js + Express (JavaScript puro com ES Modules)**, com organização em camadas, que funcione normalmente em JS, mas contenha **ambiguidades e bugs intencionais** que o TypeScript ajudará a identificar/corrigir durante a refatoração.

A API será usada como base didática para um curso de introdução a TypeScript (migração JS → TS), então o projeto deve ser:

- pequeno,
- realista,
- fácil de entender,
- sem banco de dados (usar repositórios em memória),
- com código suficientemente “imperfeito” para gerar valor pedagógico.

---

## Tema da API

### **Helpdesk / Tickets API**

Uma API para gerenciar tickets de suporte.

### Entidades principais

- **Ticket**
- **Comment**
- **User** (mock simples, só para atribuição de tickets)

---

## Escopo funcional (mínimo)

### Endpoints

#### Tickets

- `POST /tickets` → criar ticket
- `GET /tickets` → listar tickets (com filtros opcionais por query string)
- `GET /tickets/:id` → buscar ticket por id
- `PATCH /tickets/:id` → atualizar parcialmente ticket (status, prioridade, responsável)
- `POST /tickets/:id/comments` → adicionar comentário ao ticket

#### Users

- `GET /users` → listar usuários (mock)

---

## Regras de negócio (simples)

- Ticket tem:
  - `id`
  - `title`
  - `description`
  - `status`
  - `priority`
  - `assigneeId` (opcional)
  - `createdAt`
  - `updatedAt`

- Comment tem:
  - `id`
  - `ticketId`
  - `authorId`
  - `message`
  - `createdAt`

- User tem:
  - `id`
  - `name`
  - `email`

### Valores esperados (mas **não validar corretamente em JS** de propósito)

- `status` idealmente seria algo como:
  - `"open" | "in_progress" | "closed"`

- `priority` idealmente seria número (`1` a `5`)

---

## Estrutura de projeto (simples e didática)

Use uma organização em camadas básicas:

```txt
src/
  app.js
  routes/
    tickets.routes.js
    users.routes.js
  controllers/
    tickets.controller.js
    users.controller.js
  services/
    tickets.service.js
  repositories/
    tickets.repository.js
    comments.repository.js
    users.repository.js
  middlewares/
    error.middleware.js
  utils/
    id.js
    response.js   (opcional)
```

### Requisitos de implementação

- Express
- ES Modules (`"type": "module"` no `package.json`)
- imports/exports com sintaxe `import`/`export`
- `express.json()`
- Dados em memória (`array` ou `Map`)
- Sem ORM
- Sem banco
- Sem autenticação real (se quiser, pode simular um user fixo)
- O projeto precisa rodar com `node src/app.js` (ou script npm equivalente)

---

## Bugs / ambiguidades intencionais (IMPORTANTÍSSIMO)

Esses problemas devem existir **de propósito**, mas sem quebrar a execução do projeto em JS. A ideia é que o projeto “rode”, porém tenha inconsistências que o TS depois vai expor.

### 1) `status` aceita qualquer string

#### Comportamento intencional

No `POST /tickets` e `PATCH /tickets/:id`, aceitar `status` sem validação forte.

Exemplos que devem passar em JS:

- `"open"`
- `"closed"`
- `"closedd"` (typo)
- `"done"` (valor não previsto)

#### Valor pedagógico

Depois no TS isso vira union (`'open' | 'in_progress' | 'closed'`) e o compilador ajuda a bloquear valores inválidos.

---

### 2) `priority` misturando string e número

#### Comportamento intencional

Permitir que `priority` seja salvo como:

- `2` (number)
- `"2"` (string)

Sem normalizar.

#### Efeito colateral esperado (intencional)

Em listagem/ordenação, isso pode gerar comportamento estranho ou inconsistente.

#### Valor pedagógico

Excelente para mostrar:

- diferença entre JS permissivo e contratos de tipo
- necessidade de parse/validação de entrada

---

### 3) `req.query` tratada sem conversão (`limit`, `page`, `priority`)

#### Comportamento intencional

No `GET /tickets`, ler query params diretamente como se fossem números.

Exemplo:

- `?limit=10&page=1&priority=2`

Mas o código usa sem parse (`Number(...)`), contando com coerção implícita.

#### Valor pedagógico

Depois no TS fica claro que query params chegam como string/unknown e precisam de conversão segura.

---

### 4) `findById` inconsistente (`null` em um lugar, `undefined` em outro)

#### Comportamento intencional

No repository/service, ter retornos inconsistentes:

- em alguns casos `null`
- em outros `undefined`

Sem contrato claro.

#### Valor pedagógico

Ótimo para mostrar como o TS força contratos previsíveis (`Ticket | null`, por exemplo).

---

### 5) Uso direto de `req.body` sem validação real

#### Comportamento intencional

A controller deve usar `req.body` diretamente, sem schema/validação formal.

Talvez apenas checks superficiais (ex.: `if (!title) ...`), mas nada consistente.

#### Valor pedagógico

Depois é o ponto ideal para introduzir:

- `unknown` vs `any`
- validação com Zod
- inferência de tipos com `z.infer`

---

### 6) Atualização parcial permissiva demais no `PATCH`

#### Comportamento intencional

No `PATCH /tickets/:id`, aplicar tudo que vier no body via merge simples (`Object.assign` ou spread), inclusive campos não previstos.

Exemplos que devem “passar”:

- mudar `createdAt`
- adicionar campo aleatório (`foo: "bar"`)

#### Valor pedagógico

Depois no TS + DTO de update isso fica bem mais controlado.

---

### 7) IDs com tipos inconsistentes (string vs number em algum ponto)

#### Comportamento intencional

Use `id` como string na entidade, mas em algum ponto faça comparação/tratamento como número ou parse sem necessidade.

Exemplo:

- `req.params.id` comparado com `Number(...)` em um método, mas string em outro.

#### Valor pedagógico

Mostra inconsistência de contrato e como TS ajuda a padronizar.

---

### 8) Formato de retorno inconsistente entre services

#### Comportamento intencional

Alguns métodos retornam:

- `{ data: ticket }`
  Outros retornam:
- `{ ticket }`
  Outros retornam o objeto direto.

#### Valor pedagógico

Bom para introduzir contrato de retorno e, depois, union `ok/error`.

---

## Comportamentos desejados (mesmo com bugs)

Apesar das ambiguidades, a API deve:

- iniciar e responder rotas
- permitir criar/listar/atualizar tickets
- permitir comentar ticket
- retornar JSON
- ter alguns dados mockados de usuários

Ou seja: projeto **funcional o suficiente para demo**, porém **propositalmente frouxo** em contratos.

---

## Dados iniciais (seed em memória)

Criar alguns usuários mock:

- `u1`, `u2`, `u3`

Criar 2–3 tickets iniciais e alguns comentários para facilitar testes de listagem e update.

---

## O que NÃO precisa (para manter simples)

- banco de dados
- autenticação JWT
- testes automatizados como conteúdo da versão base
- documentação Swagger
- classes/POO complexa
- validação robusta
- TypeScript (nesta versão base deve ser JS)

---

## Requisitos extras para facilitar o curso depois

### 1) Código legível (mesmo sendo “imperfeito”)

- nomes claros de funções
- separação por camadas
- evitar “bagunça total”

### 2) Deixar pontos fáceis de migrar

Ex.: funções em arquivos separados, para facilitar renomear `.js` → `.ts`.

### 3) Incluir um README simples com exemplos de requests

- exemplos de `POST /tickets`
- `PATCH /tickets/:id`
- `GET /tickets?status=open&limit=10`

---

## Exemplo de payloads (para guiar implementação)

### Criar ticket (`POST /tickets`)

```json
{
  "title": "Erro ao salvar formulário",
  "description": "Usuário recebe timeout ao enviar formulário",
  "status": "open",
  "priority": "2",
  "assigneeId": "u1"
}
```

> Note: `priority` como string deve ser aceito na versão JS (intencional).

### Atualizar ticket (`PATCH /tickets/:id`)

```json
{
  "status": "closedd",
  "priority": 1
}
```

> Note: `"closedd"` deve passar na versão JS (intencional).

### Adicionar comentário (`POST /tickets/:id/comments`)

```json
{
  "authorId": "u2",
  "message": "Consegui reproduzir localmente."
}
```

---

## Saída esperada do agente (entregáveis)

Pedir para o agente gerar:

1. Projeto Node + Express em JavaScript
2. Estrutura de pastas em camadas
3. Repositórios em memória
4. Endpoints funcionando
5. Bugs/ambiguidades intencionais descritos acima
6. README com instruções para rodar e testar

> Observação para o instrutor: pode existir uma suíte de testes final/de apoio no repositório para validar a migração, mas ela não precisa ser parte do escopo didático inicial da API em JavaScript.
