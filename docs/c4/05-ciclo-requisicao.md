# Ciclo de requisição (resumo)

## Fluxo nominal

1. **Cliente HTTP** envia requisição para um endpoint da API.
2. **Route** identifica método/caminho e direciona para o controller correto.
3. **Controller** extrai dados de `req.params`, `req.query` e `req.body`.
4. **Service** executa regra de negócio necessária ao caso de uso.
5. **Repository** acessa e/ou altera coleções em memória.
6. **Service** devolve resultado já composto para a camada HTTP.
7. **Controller** traduz resultado para resposta JSON e status code.
8. **Cliente HTTP** recebe resposta final.

## Fluxo excepcional

1. Um erro não previsto ocorre durante o processamento.
2. O erro é propagado pela pipeline do Express.
3. O **middleware global de erro** monta a resposta padronizada.
4. O cliente recebe `500 Internal Server Error` com payload JSON.

## Pontos de decisão importantes

- Ticket existe? se não existir, retorno esperado em casos de consulta/atualização é `404`.
- Payload é aceitável para operação? em casos inválidos, retorno tende a `400`.
- Erro foi tratado localmente no controller? se não, vai para middleware global.

## Resultado arquitetural

Esse ciclo garante separação de responsabilidades e melhora rastreabilidade do caminho de execução para manutenção, testes e evolução para TypeScript com contratos mais rígidos.
