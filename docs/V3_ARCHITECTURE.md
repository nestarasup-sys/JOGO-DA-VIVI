# V3 Architecture

## Runtime
React + TypeScript + Vite. Zustand persiste o save. A campanha é JSON validada com Zod.

## Narrative engine
`src/game/engine.ts` resolve nós comuns, `routeVariant` e `routeScene`. `NarrativePlayer` apresenta cenário, sprites, texto e escolhas.

## Content
`src/data/season1.json` é a fonte narrativa. O Studio permite editar uma cópia em runtime.

## Asset pipeline
Folhas ficam em `assets/sheets/`. `manifest.json` descreve cada célula. `scripts/slice-sheets.mjs` usa Sharp para gerar WebP em `public/assets/`.

## Windows bootstrap
`INSTALAR_E_ATUALIZAR.bat` instala Git e Node LTS com Winget quando necessário, sincroniza o repositório, instala dependências, recorta sheets, roda testes/build e inicia Vite.

## CI
GitHub Actions executa install, recorte de assets, validação da história, testes e build; `dist/` é publicado como artifact do workflow.
