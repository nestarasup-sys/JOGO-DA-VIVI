# Plano de Sheets e Exportação

O runtime ativo usa `src/data/season1.json`, `src/game/memories.ts`, `src/data/content.ts` e os resolvers em `src/assets.ts`. O pipeline não toma `public/content/story.json` ou `src/screens/` como fonte de verdade.

## Layout canônico

- Personagens: um sheet por personagem ativo, grade 4×2, célula 512×768, ordem `neutral, smile, tease, serious, blush, angry, sad, surprised`.
- Backgrounds: sheets de preview em lotes de até 8, grade 4×2, thumbnails 640×360, com rótulo.
- CGs: sheets de preview em lotes de até 8, grade 4×2, thumbnails 640×360, com rótulo.
- Saídas: `public/assets/sheets/characters/`, `public/assets/sheets/backgrounds/`, `public/assets/sheets/cg/`.
- Individuais: `public/assets/characters/<id>/<expression>.webp`, `public/assets/backgrounds/<id>.webp`, `public/assets/cg/<id>.webp`.

## Repetição

```powershell
npm run assets:inventory
npm run assets:sheets
npm run assets:slice
npm run assets:rebuild-all
```

`assets:inventory` cria `tools/generated/asset-inventory.json` e `docs/ASSET_INVENTORY.md`. `assets:sheets` rasteriza as fontes SVG existentes e cria os previews. `assets:slice` recorta as células dos sheets de personagens e atualiza os WebP individuais.

## Estado atual

As sheets conceituais existentes fornecem seis expressões reais. `tease` usa temporariamente a célula `smile` e `sad` usa temporariamente `serious`; cada célula fica marcada como `FALLBACK` no sheet e como `missing` no inventário. Isso mantém o jogo funcional sem fingir que a arte final existe.
