# Fluxo 08 - Middleware global de erro

## Objetivo

Padronizar resposta de erro não tratado em runtime.

## Sequência

```mermaid
sequenceDiagram
    actor Cliente
    participant E as Express Pipeline
    participant H as Handler (route/controller/service)
    participant M as error.middleware

    Cliente->>E: Requisição HTTP
    E->>H: Executa handler

    alt Erro não tratado propagado com next(err) ou throw
        H-->>M: err
        M-->>Cliente: 500 { message, error }
    else Sem erro
        H-->>Cliente: Resposta normal
    end
```

## Resposta padrão atual

- `status`: `500`
- body:
  - `message`: `Internal Server Error`
  - `error`: `err.message`
