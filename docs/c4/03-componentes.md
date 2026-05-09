# Nível 3 - Componentes

## Objetivo deste nível
Explicar a decomposição interna da Aplicação Express e como as responsabilidades são separadas.

## Componentes principais

### `routes`
- Registra rotas HTTP por recurso (`/tickets`, `/users`).
- Faz o mapeamento método + caminho → ação do controller.
- Não contém regra de negócio.

### `controllers`
- Interpreta `req` e produz `res`.
- Chama services/repositories apropriados.
- Decide status HTTP e payload de resposta.
- Trata erros esperados do domínio (por exemplo, `404` para ticket ausente).

### `services`
- Concentra regras de negócio de tickets:
    - filtros e paginação
    - composição ticket + comentários
    - criação e atualização
    - resumo de ticket
- Encapsula a lógica para não espalhar regras pela camada HTTP.

### `repositories`
- Responsáveis pelo acesso aos dados em memória.
- Encapsulam operações de consulta e mutação de coleções.
- Tipicamente retornam entidades de domínio simples (objetos JS).

### `error middleware`
- Ponto central para erros não tratados.
- Responde `500` com payload padrão quando necessário.

### `id utility`
- Geração de IDs pseudoaleatórios.
- Reutilizado por repositories que criam entidades.

## Relações internas
- `routes` → `controllers`
- `controllers` → `services`
- `services` → `repositories`
- `repositories` → `id utility`
- fluxo excepcional → `error middleware`

## Benefício didático
A separação por camadas facilita a manutenção e a evolução contínua do projeto em TypeScript, permitindo ajustar tipagem, validação e regras de negócio por componente sem reescrever o sistema inteiro.
