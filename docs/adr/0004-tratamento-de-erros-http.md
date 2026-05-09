# ADR-0004 - Tratamento de erros HTTP

- **Status:** Aceito
- **Data:** 2026-05-06
- **Revisado em:** 2026-05-09

## Contexto

O projeto precisa de comportamento previsível de erro para consumo de API e testes automatizados.

## Decisão

Adotar hierarquia de erros tipados com mapeamento central no middleware global:

- `src/errors/app-error.ts` define a classe base `AppError` e subclasses:
  - `NotFoundError` → HTTP 404, code `TICKET_NOT_FOUND`
  - `ValidationError` → HTTP 400, code `INVALID_REQUEST`
- Controllers e services lançam erros tipados em vez de responder diretamente.
- O middleware global (`error.middleware.ts`) é o único ponto de tradução para HTTP:
  - `AppError` → `{ code, error, details? }` com `statusCode` da instância.
  - Demais erros → `{ code: "INTERNAL_SERVER_ERROR", message, error }` com status 500.
- Mensagens centralizadas em `src/constants/error-messages.ts`.
- Códigos de erro centralizados em `src/constants/error-codes.ts`.

### Formato do payload de erro (domínio/validação)

```json
{
  "code": "INVALID_REQUEST",
  "error": "Invalid request",
  "details": { "issues": [] }
}
```

### Formato do payload de erro (fallback interno)

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal Server Error",
  "error": "Mensagem do erro interno"
}
```

## Consequências

### Positivas

- Respostas de erro consistentes em todos os endpoints.
- Nenhuma string de erro duplicada no código.
- Erros internos não são mascarados como erros de cliente.
- Contrato de erro verificável em testes E2E (`code`, `error`, `details`).
- Fácil adição de novos tipos de erro: basta estender `AppError`.

### Negativas

- Para um projeto pequeno, adiciona mais arquivos de suporte.
- Requer disciplina para sempre usar os tipos tipados em vez de `throw new Error()`.
