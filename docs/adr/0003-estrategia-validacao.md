# ADR-0003 - Estratégia de validação

- **Status:** Aceito
- **Data:** 2026-05-06
- **Revisado em:** 2026-05-08

## Contexto

Após a migração para TypeScript, o projeto passou a exigir contratos HTTP mais previsíveis e erros de entrada mais claros. A API já utiliza Zod como biblioteca de validação e os endpoints principais estão tipados.

## Decisão

Adotar validação de entrada na camada de controller com Zod como padrão oficial do projeto:

1. Controllers validam req.body e req.query antes de acionar services.
2. Services recebem dados já validados e focam em regra de negócio.
3. Coerções e restrições de formato (ex.: string para number, faixas de valores e enums) ficam centralizadas nos schemas.
4. Falhas de validação retornam 400 Bad Request com mensagem consistente.

## Consequências

### Positivas

- Contratos HTTP ficam explícitos e previsíveis.
- Reduz ambiguidade de tipos na fronteira da aplicação.
- Diminui lógica defensiva repetida na camada de serviço.
- Facilita manutenção e evolução de endpoints.

### Negativas

- Controllers ficam mais extensos quando concentram vários schemas.
- É necessário manter sincronia entre DTOs/tipos de domínio e schemas Zod.
