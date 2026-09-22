# Arquitetura — Aurora V3 Ultra

## Objetivo

Separar motor, conteúdo e assets para o jogo crescer sem virar um HTML monolítico.

## Camadas

- `src/engine/`: regras narrativas, condições e validação.
- `src/store/`: save persistente, afinidades, traits, rota, mensagens, inventário e tempo.
- `src/screens/`: telas independentes.
- `public/content/story.json`: campanha e catálogos.
- `public/assets/`: arte versionada.
- `tools/`: pipeline de assets.
- `scripts/`: validação de conteúdo.
- `.github/workflows/`: build automática.

## Estado persistente

Schema de save: **3**.

O estado inclui: protagonista, posição narrativa, afinidades, traits, Lúmens, flags, CGs, roupas, mensagens, rota, calendário, episódios concluídos, locais visitados, conquistas e histórico.

## Motor narrativo

Cada episódio é um grafo de nodes. Nodes suportados:

- `narration`
- `dialogue`
- `choice`
- `end`

Escolhas apontam para outro node pelo campo `to`. O validador confirma referências e se existe caminho até um final.

## PWA

Vite + vite-plugin-pwa. A build pode ser instalada como app web e funciona sem depender de CDN para o conteúdo principal.
