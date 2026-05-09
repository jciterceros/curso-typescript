# Nível 1 - Contexto

## Objetivo deste nível
Descrever o sistema como uma caixa-preta, identificando quem interage com ele e por qual meio.

## Sistema principal
- **Nome:** Helpdesk API
- **Responsabilidade:** fornecer endpoints REST para gestão de tickets de suporte, comentários e usuários.
- **Tecnologia percebida externamente:** HTTP + JSON.

## Atores externos

### 1) Cliente API
Consumidor técnico da API (por exemplo, coleções no Bruno, testes automatizados com Supertest/Vitest ou um frontend).

**Interações principais:**
- consulta tickets (`GET /tickets`, `GET /tickets/:id`, `GET /tickets/:id/summary`)
- cria e atualiza tickets (`POST /tickets`, `PATCH /tickets/:id`)
- adiciona comentários (`POST /tickets/:id/comments`)
- consulta usuários (`GET /users`)

### 2) Instrutor/Aluno
Pessoa que executa localmente a aplicação para fins didáticos (curso de migração JS → TS).

**Interações principais:**
- sobe ambiente com `npm run dev`
- valida comportamento com `npm test`
- observa contratos de entrada e saída da API

## Relações e fronteiras
- O cliente externo **não acessa estruturas internas** (service/repository); acessa somente endpoints HTTP.
- O instrutor/aluno **não é usuário final da API**, e sim operador do ambiente de desenvolvimento.
- O sistema não depende de banco externo neste estágio; o armazenamento é interno ao processo.

## Restrições de contexto
- uso local/educacional
- sem autenticação/autorização formal
- sem integração com serviços externos críticos
- persistência volátil (reinício do processo limpa os dados em memória)

## Resultado arquitetural esperado
Este contexto delimita claramente: quem usa, por qual protocolo usa e qual o limite de responsabilidade da Helpdesk API.
