# Nível 2 - Contêineres

## Objetivo deste nível

Detalhar os blocos executáveis/deployáveis da solução e suas comunicações.

## Contêiner 1 - Aplicação Express

- **Tipo:** aplicação backend monolítica
- **Tecnologia:** Node.js + Express
- **Entrada:** requisições HTTP com payload JSON
- **Saída:** respostas HTTP em JSON
- **Responsabilidades:**
  - roteamento de endpoints
  - tratamento de entrada HTTP
  - orquestração de regras de negócio
  - formatação de respostas e códigos de status

## Contêiner 2 - Memória do processo

- **Tipo:** armazenamento volátil em runtime
- **Tecnologia:** arrays em memória (estruturas tipadas da aplicação)
- **Responsabilidades:**
  - manter coleções de tickets, comments e users
  - permitir leitura/escrita durante o ciclo do processo

## Comunicação entre contêineres

- A Aplicação Express consulta e altera a Memória do processo de forma síncrona, por chamadas internas de código.
- Não há conexão de rede interna entre contêineres; a comunicação é in-process.

## Interface externa do nível de contêiner

- Cliente API → Aplicação Express via HTTP/JSON.
- Não existe acesso direto do cliente à Memória do processo.

## Consequências arquiteturais

### Vantagens

- setup simples e rápido para aula
- baixa complexidade operacional
- feedback imediato para testes e exercícios

### Limitações

- sem persistência durável
- escalabilidade horizontal limitada
- sem isolamento de dados entre execuções
