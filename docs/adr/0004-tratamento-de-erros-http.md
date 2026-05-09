# ADR-0004 - Tratamento de erros HTTP

- **Status:** Aceito
- **Data:** 2026-05-06
- **Revisado em:** 2026-05-08

## Contexto
O projeto precisa de comportamento previsível de erro para consumo de API e testes automatizados.

## Decisão
- Erros de domínio conhecidos retornam no controller (ex.: `404 Ticket not found`, `400 bad request`).
- Erros não tratados passam pelo middleware global e retornam `500` com payload padrão.

## Consequências
### Positivas
- Respostas de erro ficam consistentes.
- Facilita leitura e manutenção dos testes.

### Negativas
- Mistura estratégia local (controller) e global (middleware).
- Mensagens de erro ainda podem variar entre endpoints.
