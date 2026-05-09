## Plano de Aula - Introdução a TypeScript para Desenvolvedores JavaScript

### 1. Informações gerais
- **Nome sugerido:** **Do JavaScript ao TypeScript: Migração Prática de uma API com Express**
- **Carga horária total:** **8 horas** (4 encontros de 2h)
- **Tempo previsto de conteúdo prático:** **6h a 6h40**
- **Público-alvo:** pessoas com conhecimento básico de JavaScript que estão entrando na área
- **Formato:** aula prática guiada (hands-on), com exposição curta + demonstração + exercícios pontuais
- **Ambiente da aula:** atividades feitas nos computadores do local (laboratório/sala), sem depender de notebook próprio
- **Pré-requisitos:**
  - JavaScript básico (variáveis, funções, objetos, arrays, async/await)
  - Noções iniciais de API REST e Express
  - Uso básico de terminal e npm

---

## 2. Como o curso foi planejado
Este plano considera a dinâmica real de uma turma presencial: parte do tempo sempre é consumida por questões operacionais.

- chegada e saída de participantes;
- problemas de rede e instalação;
- diferenças de ritmo entre as pessoas;
- dúvidas de ambiente e configuração;
- tempo para acesso e preparação dos computadores;
- transições entre blocos e retomadas.

### Critério de planejamento
- O curso **não será planejado como 8h “cheias” de conteúdo**.
- O conteúdo essencial foi dimensionado para **6h a 6h40 úteis**.
- O restante da carga horária fica como **folga de agenda** (imprevistos, dúvidas, ajustes de ritmo).

Com isso, a chance de cumprir os objetivos aumenta sem precisar acelerar demais ou deixar parte da turma para trás.

---

## 3. Por que este curso
- Muitas pessoas começam em projetos Node/Express em JavaScript e precisam aprender TypeScript em contexto real, não só com exemplos isolados.
- Para quem está começando, muitas vezes não é óbvio por que usar uma linguagem tipada: no início, pode parecer que ela só deixa o trabalho mais difícil ou mais lento.
- Também é comum ser difícil explicar com clareza as vantagens da tipagem apenas na teoria, sem mostrar problemas reais acontecendo no código.
- A abordagem de **migração incremental de uma API existente (JS -> TS)** aproxima o curso da prática profissional:
  - reduz risco de reescrita;
  - mostra ganhos rápidos de produtividade;
  - deixa visíveis bugs silenciosos que o TypeScript ajuda a evitar;
  - ensina uma estratégia de adoção gradual.
- Como o tempo é curto, a prioridade é **aplicação prática e fundamentos úteis**, e não cobrir toda a linguagem.

---

## 4. Objetivo do curso
Levar a turma a aplicar os fundamentos de TypeScript na prática, refatorando uma API Express de JavaScript para TypeScript e percebendo ganhos reais de segurança, clareza e produtividade.

---

## 5. Objetivos específicos
Ao final do curso, cada participante deverá ser capaz de:
- compreender o papel do TypeScript no desenvolvimento de APIs Node/Express;
- configurar um projeto TypeScript básico com Express;
- aplicar tipagem em funções, objetos, parâmetros e retornos;
- modelar dados com `type` e `interface`;
- usar unions e narrowing para tratar estados e erros com segurança;
- diferenciar `any` e `unknown`, adotando práticas mais seguras;
- validar payloads de entrada com suporte à inferência de tipos (ex.: Zod);
- refatorar endpoints e services de forma incremental;
- reconhecer bugs/ambiguidades comuns em JavaScript que TypeScript ajuda a prevenir.

---

## 6. Competências trabalhadas
### Técnicas
- Tipagem estática aplicada ao backend com Node/Express
- Modelagem de contratos de API (DTOs)
- Leitura e correção de erros de tipagem (TypeScript/`tsc`)
- Validação de dados de entrada em APIs
- Organização de código em camadas simples (routes/controllers/services/repositories)

### Profissionais
- Raciocínio orientado a contratos
- Refatoração incremental com baixo risco
- Comunicação técnica sobre decisões simples de código
- Leitura crítica de código legado em JavaScript

---

## 7. Ementa (visão resumida)
- Introdução ao TypeScript no contexto de APIs Express
- Setup e configuração do projeto TypeScript
- Fundamentos de tipagem aplicados ao domínio da API
- Modelagem de entidades e DTOs com `type`/`interface`
- Unions, narrowing e tratamento seguro de erros/estados
- Validação de payloads com inferência de tipos
- Refatoração incremental de endpoints, services e repositories
- Boas práticas iniciais de adoção de TypeScript em projetos reais

> **Observação:** Implementação de endpoint adicional e extensões de arquitetura entram como conteúdo **desejável/bônus**, dependendo do ritmo da turma.

---

## 8. Como a aula vai acontecer
### Abordagem didática
- **Aprendizagem baseada em refatoração real**
  - Partimos de uma API funcional em JavaScript (com ambiguidades intencionais)
  - A turma acompanha a migração gradual para TypeScript
- **Exposição curta + demonstração + prática**
  - Os conceitos entram no momento em que aparecem no código
- **Foco em contexto profissional**
  - Mostrar como migrar sem reescrever tudo
  - Explicar ganhos e limites do TypeScript em APIs simples

### Estratégias de aprendizagem ativa (mão na massa)
As pessoas participantes **não só assistem**: elas executam etapas práticas com feedback imediato do TypeScript (`tsc`), da API e das chamadas via Bruno.

> **Nota sobre a ferramenta Bruno:** Bruno é um cliente de API open source (semelhante ao Postman e ao Insomnia), usado para criar, enviar e organizar requisições HTTP de teste dos endpoints durante a aula.

#### Práticas propostas ao longo do curso
- Setup inicial do TypeScript no projeto (scripts e build)
- Criação/ajuste de tipos de domínio (`Ticket`, DTOs, unions de status)
- Correção de bugs intencionais usando mensagens do TypeScript (`tsc`)
- Tipagem de um endpoint completo (`POST /tickets`) em múltiplas camadas
- Validação de payload com Zod + `z.infer`
- Tipagem e validação de query params (`GET /tickets`)
- Execução de requests no Bruno para validar cenários de sucesso e erro
- Pequenos ajustes/mini desafios de extensão (se houver tempo)

### Estrutura de cada bloco (ritmo recomendado)
- **10-15 min** explicação/demonstração
- **15-30 min** prática guiada dos participantes
- **5-10 min** revisão coletiva (solução e erros comuns)

Esse formato ajuda a manter o ritmo, reduzir a ansiedade de quem está começando e garantir participação ativa.

---

## 9. Projeto usado na aula
### Tema da API
**Helpdesk / Ticket API (Express)**

### Escopo funcional do projeto-base (JS)
- Cadastro de tickets
- Listagem com filtros
- Atualização parcial de ticket (status/prioridade/responsável)
- Comentários em tickets
- Listagem simples de usuários (mock)

### Organização básica do código (camadas simples)
- `routes/`
- `controllers/`
- `services/`
- `repositories/` (em memória)
- `middlewares/`
- `utils/`
- (na versão TS) `domain/` e `schemas/`

### Biblioteca de apoio destacada
- **Zod** para validação de payloads e inferência de tipos (`z.infer`)
  - importante para explicar a diferença entre:
    - **tipagem em tempo de compilação** (TypeScript)
    - **validação em runtime** (entrada da API)

---

## 10. Bugs e ambiguidades intencionais (recurso de ensino)
### Exemplos planejados
- `status` aceitando qualquer string (`"closedd"`)
- `priority` misturando número e string (`2` vs `"2"`)
- `limit/page` vindos da query tratados como número sem conversão
- retorno inconsistente de repository (`null` vs `undefined`)
- uso direto de `req.body` sem validação

### Objetivo
Demonstrar situações em que:
- o JavaScript executa sem erro imediato;
- mas o comportamento fica inconsistente;
- e o TypeScript ajuda a bloquear ou explicitar o problema antes da execução.

---

## 11. Escopo por prioridade (essencial, desejável e bônus)

### 11.1. Escopo essencial (obrigatório)
Este é o **núcleo do curso**. Mesmo com imprevistos, este bloco precisa ser entregue.

- Configurar TypeScript no projeto Express (setup mínimo funcional)
- Migrar e tipar o **domínio principal** (`Ticket`, DTOs, status)
- Migrar **1 endpoint completo** (ex.: `POST /tickets`) com:
  - route/controller/service/repository
  - tipagem de dados e retornos
- Explicar e aplicar `any` vs `unknown` no contexto de entrada de API
- Validar **1 payload** com Zod + inferência de tipo
- Corrigir pelo menos **2 bugs/ambiguidades intencionais**
- Demonstrar claramente o **antes/depois** (JS vs TS) em segurança e DX

### 11.2. Escopo desejável (se o ritmo da turma permitir)
- Tipar listagem com filtros (`GET /tickets`) e query params
- Padronizar retorno de service com union (`ok/error`)
- Introduzir narrowing em tratamento de estados/erros
- Melhorar organização de tipos e schemas

### 11.3. Escopo bônus (somente se sobrar tempo)
- Implementar endpoint novo (ex.: `GET /tickets/:id/timeline`)
- Mini desafio de extensão para participantes
- Padronização mais completa de erros/middlewares
- Comentários sobre próximos passos (strict mode gradual, testes, etc.)

> **Importante:** endpoint novo e extensões são tratados como bônus para não comprometer a entrega do conteúdo essencial em cenário presencial.

---

## 12. Conteúdo programático detalhado (8h totais / ~6h a 6h40 de conteúdo)

## Encontro 1 - 2h (presencial)
### Módulo 1. Contexto e motivação (20-25 min)
**Conteúdo**
- O que TypeScript resolve e o que não resolve
- Por que refatorar uma API JS existente (em vez de criar tudo do zero)
- Demonstração rápida de bug silencioso em JS que TS ajuda a prevenir

**Pontos para alinhar com a organização**
- A escolha por migração aproxima o conteúdo do mundo real
- O curso prioriza valor prático imediato para iniciantes

---

### Módulo 2. Setup mínimo de TypeScript com Express (45-55 min)
**Conteúdo**
- Dependências essenciais (`typescript`, `@types/express`, executor TS)
- `tsconfig.json` inicial com `module`/`moduleResolution` em `NodeNext`
- Migração gradual mantendo ES Modules e imports relativos com extensão `.js`
- Scripts de build e execução
- Estratégia de migração gradual por arquivos

**Prática dos alunos (aprendizagem ativa)**
- Rodar build
- Ajustar script
- Renomear arquivo e fazer transpilar

**Plano B se houver atraso de setup**
- Uso de projeto pré-configurado (branch/tag pronta)
- Trabalho em dupla para manter ritmo

---

### Módulo 3. Primeiro contato com erros do TypeScript (25-30 min)
**Conteúdo**
- Leitura inicial de mensagens do `tsc`
- Diferença entre erro de compilação e erro em runtime
- Como usar o TypeScript como apoio durante a refatoração

**Prática dos alunos**
- Rodar `tsc` e identificar erros simples
- Corrigir um erro guiado pelo instrutor
- Testar a API após o primeiro ajuste

---

### Módulo 4. Fechamento do encontro + checkpoint (10-15 min)
**Conteúdo**
- Revisão do setup realizado
- Alinhamento dos arquivos que serão migrados no encontro seguinte
- Checagem de ambiente para reduzir problemas no próximo encontro

---

## Encontro 2 - 2h (presencial)
### Módulo 5. Fundamentos de tipagem no domínio da API (55-65 min)
**Conteúdo**
- Tipos básicos + inferência
- Tipagem de funções (parâmetros/retorno)
- Objetos e arrays
- `type` vs `interface` (na prática, sem aprofundamento excessivo)
- Modelagem de `Ticket`, `CreateTicketDTO`, `UpdateTicketDTO`

**Prática dos alunos**
- Criar/ajustar tipos de domínio
- Definir `status` como union
- Decidir campos opcionais nos DTOs

---

### Módulo 6. Modelagem entre camadas (35-45 min)
**Conteúdo**
- Contratos entre controller, service e repository
- Tipagem de parâmetros e retornos nas funções
- Organização inicial de `domain/` e tipos compartilhados

**Prática dos alunos**
- Aplicar tipos em funções existentes
- Corrigir incompatibilidades entre camadas
- Observar ganhos de autocomplete e documentação no editor

---

### Módulo 7. Fechamento do encontro + checkpoint (10-15 min)
**Conteúdo**
- Revisão dos tipos criados
- Lista dos bugs/ambiguidades já evidenciados pelo TypeScript
- Preparação para a migração do endpoint principal

---

## Encontro 3 - 2h (presencial)
### Módulo 8. Primeira refatoração real (endpoint principal) (50-60 min)
**Conteúdo**
- Migração de um endpoint central (`POST /tickets`)
- Ajustes entre controller/service/repository
- Leitura de erros de tipagem do TypeScript e correção guiada
- Ganhos de autocomplete e contratos entre camadas

**Prática dos alunos**
- Tipar endpoint em uma ou mais camadas
- Corrigir erros apontados pelo TS
- Testar o endpoint após refatoração

---

### Módulo 9. `any`, `unknown` e validação de entrada com Zod (45-55 min)
**Conteúdo**
- Diferença prática entre `any` e `unknown`
- Riscos de confiar em `req.body`/`req.query`
- Schema com Zod
- Inferência de tipos com `z.infer`

**Prática dos alunos**
- Criar schema de payload
- Validar `req.body`
- Testar payload válido/inválido no Bruno

---

### Módulo 10. Fechamento do encontro + checkpoint (10-15 min)
**Conteúdo**
- Revisão do endpoint migrado
- Comparação parcial entre entrada não validada e entrada validada
- Alinhamento do que entra no encontro final

---

## Encontro 4 - 2h (presencial)
### Módulo 11. Unions, narrowing e tratamento de estados/erros (35-45 min)
**Conteúdo**
- Union types (ex.: status)
- Discriminated unions para retorno de service (`ok/error`)
- Narrowing com `if`/`switch`
- Tratamento de erro simples e consistente

**Prática dos alunos**
- Ajustar retorno de service para union
- Atualizar controller para tratamento tipado
- Observar o TypeScript (`tsc`) “guiando” os casos possíveis

---

### Módulo 12. Listagem com filtros (query params tipados) - parte desejável (35-45 min)
**Conteúdo**
- Conversão e validação de `status`, `priority`, `limit`, `page`
- Tipagem de filtros e contrato de repository
- Correção de bugs de string vs number

**Prática dos alunos**
- Tipar query params de listagem
- Corrigir bug clássico de coerção em JS

> Este módulo pode ser reduzido ou simplificado se houver atraso operacional.

---

### Módulo 13. Fechamento: comparação JS vs TS + próximos passos (25-35 min)
**Conteúdo**
- Revisão “antes/depois” da API
- Quais bugs/ambiguidades foram eliminados
- Como aplicar a mesma estratégia em projeto real
- Próximos passos de estudo (sem aprofundar)

**Se houver tempo (bônus)**
- Início de endpoint adicional (ex.: `GET /tickets/:id/timeline`)
- Mini desafio orientado

---

## 13. Riscos e plano de contingência
### Riscos esperados
- problemas de rede/instalação;
- atrasos na entrada e na volta dos intervalos;
- diferenças de ritmo entre participantes;
- dúvidas de ambiente consumindo tempo de conteúdo.

### Estratégias de mitigação
- projeto-base em JavaScript previamente preparado;
- branches/tags por etapa (início, meio, final);
- material de apoio com comandos essenciais;
- possibilidade de trabalho em dupla;
- validação prévia do ambiente dos computadores disponibilizados (Node.js, npm, editor, Bruno e acesso a terminal);
- escopo do curso dividido em **essencial / desejável / bônus**;
- plano B para setup (projeto pré-configurado).

### Resultado esperado com essa abordagem
Mesmo com imprevistos, a turma deve concluir o **escopo essencial** e sair com uma compreensão prática de:
- setup TS em Express,
- tipagem de domínio e endpoint,
- validação com Zod,
- ganhos reais do TypeScript em uma API.

---

## 14. Como a aprendizagem será acompanhada
Como a carga é introdutória e distribuída em quatro encontros curtos, a avaliação é **formativa** e baseada em participação + aplicação prática.

### Critérios sugeridos
- compreensão dos conceitos básicos apresentados;
- capacidade de acompanhar e explicar uma refatoração simples;
- leitura e interpretação de erros do TypeScript;
- aplicação de tipagem em endpoint/service com apoio do instrutor;
- participação nas práticas e discussões sobre bugs/melhorias.

### Instrumentos
- checkpoints práticos durante a aula;
- perguntas orientadoras;
- correção coletiva de bugs intencionais;
- mini exercício de extensão (se houver tempo);
- revisão final “antes/depois”.

---

## 15. Recursos necessários
### Infraestrutura
- Computadores disponibilizados pelo ambiente da aula (1 por participante ou duplas), previamente preparados para o curso
- Node.js e npm instalados
- Editor (VS Code recomendado)
- Terminal
- Bruno instalado (preferencialmente versão portátil)

### Materiais do instrutor
- Projeto-base em JavaScript (pré-preparado)
- Branches/tags por etapa (recomendado)
- Slides curtos (conceitos essenciais)
- Coleção do Bruno com requests de teste dos endpoints (organizada por módulo)
- Cheatsheet de comandos e tipos básicos

---

## 16. O que não entra neste curso
Para manter foco em 8h e no público iniciante, o curso **não aprofunda**:
- generics avançados;
- tipos condicionais/mapeados avançados;
- arquitetura complexa (DDD/Clean Architecture completa);
- banco de dados/ORM com migrations;
- testes automatizados;
- POO avançada (herança, abstrações complexas).

### Observação sobre POO
- O curso **não depende de POO** para ensinar TypeScript.
- POO pode ser mencionada de forma contextual (classes/contratos), mas o foco é:
  - tipagem de dados,
  - funções,
  - serviços,
  - validação,
  - contratos entre camadas.

---

## 17. Resultados esperados para a organização
- Introdução prática e realista ao TypeScript para iniciantes em backend
- Maior confiança para atuar em APIs Node/Express tipadas
- Redução de erros comuns de contrato (payload, status, filtros)
- Base sólida para trilhas futuras (TS intermediário, testes, ORMs, frameworks)

---

## 18. Resumo rápido
- **Proposta:** curso prático de TypeScript com refatoração de API Express em JavaScript.
- **Duração:** 8h nominais (4 encontros de 2h), planejado para 6h a 6h40 úteis de conteúdo.
- **Estratégia:** escopo dividido em **essencial, desejável e bônus**, para lidar com imprevistos de presencial.
- **Diferencial:** aprendizagem ativa com prática curta, bugs intencionais e refatoração guiada.
- **Entrega mínima garantida (escopo essencial):** setup TS + tipagem de domínio + 1 endpoint completo + validação com Zod + correção de bugs reais.
