# Fluxo 01 - GET /tickets

## Objetivo

Listar tickets com filtros opcionais (`status`, `priority`) e paginação (`limit`, `page`).

## Sequência

```mermaid
sequenceDiagram
    actor Cliente
    participant R as TicketsRoute
    participant C as TicketsController.index
    participant S as TicketsService.listTickets
    participant T as TicketsRepository.findAll

    Cliente->>R: GET /tickets ? status & priority & limit & page
    R->>C: req, res
    C->>S: listTickets(req.query)
    S->>T: findAll()
    T-->>S: tickets[]
    S-->>S: aplica filtros + paginação
    S-->>C: { data, total }
    C-->>Cliente: 200 JSON
```

## Regras observadas

- `status` é filtro por igualdade exata.
- `priority` usa igualdade estrita (`===`).
- `limit` e `page` chegam da query e participam de cálculo de slice.
