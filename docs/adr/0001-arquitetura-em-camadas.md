# ADR-0001 - Arquitetura em camadas

- **Status:** Aceito
- **Data:** 2026-05-06
- **Revisado em:** 2026-05-08

## Contexto
O projeto é didático e precisa ser simples, mas com separação suficiente para ensinar responsabilidades por camada.

## Decisão
Adotar arquitetura em camadas:
- `routes` para roteamento HTTP
- `controllers` para interface HTTP
- `services` para regras de negócio
- `repositories` para acesso a dados
- `middlewares` para tratamento transversal

## Consequências
### Positivas
- Facilita entendimento do fluxo ponta a ponta.
- Permite migrar e tipar camada por camada.
- Ajuda na manutenção e no teste.

### Negativas
- Para um projeto pequeno, adiciona mais arquivos.
- Alguns fluxos podem parecer verbosos.
