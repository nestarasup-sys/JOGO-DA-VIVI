# Cânone de Nomes de Assets

## IDs

- Personagens ativos: `gael`, `leon`, `ravi`, `maya`, `player`.
- Expressões: `neutral`, `smile`, `tease`, `serious`, `blush`, `angry`, `sad`, `surprised`.
- Backgrounds e CGs: minúsculas, ASCII, palavras separadas por hífen quando necessário.
- CGs sempre começam com `cg_` no conteúdo narrativo, mas o arquivo usa o mesmo ID (`cg_intro.webp`).

## Pastas

```text
public/assets/
  characters/<character>/<expression>.webp
  backgrounds/<background>.webp
  cg/<cg-id>.webp
  sheets/characters/<character>-sheet.webp
  sheets/backgrounds/background-01.webp
  sheets/cg/cg-01.webp
```

SVGs existentes continuam sendo fontes conceituais. O runtime consome as saídas WebP canônicas por meio de `src/assets.ts`. A identidade visual estabelecida é preservada; o pipeline não gera arte nova automaticamente e apenas marca fallbacks que precisam de geração futura.
