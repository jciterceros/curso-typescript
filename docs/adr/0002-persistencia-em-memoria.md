# ADR-0002 - Persistência em memória

- **Status:** Aceito
- **Data:** 2026-05-06
- **Revisado em:** 2026-05-08

## Contexto

O foco do curso é migração JS→TS e não integração com banco de dados.

## Decisão

Persistir dados em arrays no processo (`tickets`, `comments`, `users`) dentro dos repositórios.

## Consequências

### Positivas

- Setup rápido e sem dependências externas.
- Turma foca em contrato e tipagem.
- Execução simples em laboratório.

### Negativas

- Dados são perdidos ao reiniciar o servidor.
- Não representa cenários reais de concorrência/transação.
- Limita testes de integração com infraestrutura.
