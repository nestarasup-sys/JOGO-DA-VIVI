# Pipeline de Assets

## Folhas geradas no ChatGPT

Formato recomendado para personagens finais:

- fundo transparente;
- mesma personagem em todas as células;
- corpo/escala alinhados;
- 3 colunas × 2 linhas;
- ordem: `neutral, smile, serious, angry, blush, surprised`;
- resolução sugerida: 3072×2048 ou maior.

Salve a folha em:

`tools/incoming/NOME_sheet.png`

Depois:

```bat
python tools\slice_character_sheet.py --input tools\incoming\gael_sheet.png --character gael --cols 3 --rows 2 --names neutral,smile,serious,angry,blush,surprised --trim
```

O script cria PNG + WebP individuais e `manifest.json`.

## Otimização em lote

```bat
python tools\optimize_assets.py --root public\assets --quality 92
```

## Convenções

- backgrounds: 1920×1080 ou 3840×2160;
- CGs: 16:9;
- sprites: PNG/WebP com alpha;
- áudio: OGG/MP3;
- raster pesado é rastreado pelo Git LFS.

Os SVGs atuais são **concept assets originais** e servem como fallback funcional. Podem ser substituídos por arte final sem alterar o motor.
