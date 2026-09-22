# Pipeline de Assets

O pipeline oficial é Node.js + Sharp. Ele parte da árvore real do runtime ativo, gera inventário, normaliza saídas WebP e constrói sheets reproduzíveis.

```powershell
npm run assets:inventory
npm run assets:sheets
npm run assets:slice
npm run assets:rebuild-all
```

Saídas principais:

- `tools/generated/asset-inventory.json` e `docs/ASSET_INVENTORY.md`;
- `tools/generated/asset-sheets-manifest.json`;
- `public/assets/sheets/characters/`, `backgrounds/` e `cg/`;
- WebP individuais em `public/assets/characters/<id>/`, `backgrounds/` e `cg/`.

Os SVGs existentes são fontes conceituais originais. Quando a campanha referencia um ID que não possui fonte correspondente, o pipeline cria um fallback de continuidade, registra a origem em `tools/generated/asset-fallbacks.json` e mantém o item como `missing` no inventário.

O script Python legado continua disponível para uso manual, mas não é usado pelo build nem é a fonte de verdade do pipeline atual.
