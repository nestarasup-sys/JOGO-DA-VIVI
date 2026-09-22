# Inventário de Assets

Gerado em 2026-09-22T12:11:59.626Z. Fonte ativa: `src/store/gameStore.ts -> src/data/season1.json`; o catálogo legado `public/content/story.json` não é carregado pelo app atual.

## Resumo

- Personagens ativos: **5** (gael, leon, maya, player, ravi).
- Expressões usadas: **8** (neutral, smile, tease, serious, blush, angry, sad, surprised).
- Backgrounds: **12**.
- CGs no catálogo ativo/finais: **12**.
- Sheets planejados: **9** (5 personagens + 2 backgrounds + 2 CGs).

## Inconsistências relevantes

- As fontes SVG de personagens têm 6 células: `neutral, smile, serious, angry, blush, surprised`. As expressões `tease` e `sad` são usadas pela campanha mas não existem como arte-fonte; o pipeline gera saídas fallback e as mantém marcadas como `missing`.
- O runtime usa o id `player`, enquanto a sheet legada correspondente se chama `vivi-sheet.svg`; a normalização gera `player/*` a partir dessa fonte.
- `iris` e as referências do catálogo em `public/content/story.json` pertencem à arquitetura paralela/legada e são classificados como não ativos.

## Tabela completa

| Categoria | Asset id | Caminho atual/saída | Status | Observações |
|---|---|---|---|---|
| character-sprite | `gael/neutral` | `public/assets/characters/gael/neutral.webp` | ok | asset canônico encontrado |
| character-sprite | `gael/smile` | `public/assets/characters/gael/smile.webp` | ok | asset canônico encontrado |
| character-sprite | `gael/tease` | `public/assets/characters/gael/tease.webp` | ok | asset canônico encontrado |
| character-sprite | `gael/serious` | `public/assets/characters/gael/serious.webp` | ok | asset canônico encontrado |
| character-sprite | `gael/blush` | `public/assets/characters/gael/blush.webp` | ok | asset canônico encontrado |
| character-sprite | `gael/angry` | `public/assets/characters/gael/angry.webp` | ok | asset canônico encontrado |
| character-sprite | `gael/sad` | `public/assets/characters/gael/sad.webp` | ok | asset canônico encontrado |
| character-sprite | `gael/surprised` | `public/assets/characters/gael/surprised.webp` | ok | asset canônico encontrado |
| character-sprite | `leon/neutral` | `public/assets/characters/leon/neutral.webp` | ok | asset canônico encontrado |
| character-sprite | `leon/smile` | `public/assets/characters/leon/smile.webp` | ok | asset canônico encontrado |
| character-sprite | `leon/tease` | `public/assets/characters/leon/tease.webp` | ok | asset canônico encontrado |
| character-sprite | `leon/serious` | `public/assets/characters/leon/serious.webp` | ok | asset canônico encontrado |
| character-sprite | `leon/blush` | `public/assets/characters/leon/blush.webp` | ok | asset canônico encontrado |
| character-sprite | `leon/angry` | `public/assets/characters/leon/angry.webp` | ok | asset canônico encontrado |
| character-sprite | `leon/sad` | `public/assets/characters/leon/sad.webp` | ok | asset canônico encontrado |
| character-sprite | `leon/surprised` | `public/assets/characters/leon/surprised.webp` | ok | asset canônico encontrado |
| character-sprite | `maya/neutral` | `public/assets/characters/maya/neutral.webp` | ok | asset canônico encontrado |
| character-sprite | `maya/smile` | `public/assets/characters/maya/smile.webp` | ok | asset canônico encontrado |
| character-sprite | `maya/tease` | `public/assets/characters/maya/tease.webp` | ok | asset canônico encontrado |
| character-sprite | `maya/serious` | `public/assets/characters/maya/serious.webp` | ok | asset canônico encontrado |
| character-sprite | `maya/blush` | `public/assets/characters/maya/blush.webp` | ok | asset canônico encontrado |
| character-sprite | `maya/angry` | `public/assets/characters/maya/angry.webp` | ok | asset canônico encontrado |
| character-sprite | `maya/sad` | `public/assets/characters/maya/sad.webp` | ok | asset canônico encontrado |
| character-sprite | `maya/surprised` | `public/assets/characters/maya/surprised.webp` | ok | asset canônico encontrado |
| character-sprite | `player/neutral` | `public/assets/characters/player/neutral.webp` | ok | asset canônico encontrado |
| character-sprite | `player/smile` | `public/assets/characters/player/smile.webp` | ok | asset canônico encontrado |
| character-sprite | `player/tease` | `public/assets/characters/player/tease.webp` | ok | asset canônico encontrado |
| character-sprite | `player/serious` | `public/assets/characters/player/serious.webp` | ok | asset canônico encontrado |
| character-sprite | `player/blush` | `public/assets/characters/player/blush.webp` | ok | asset canônico encontrado |
| character-sprite | `player/angry` | `public/assets/characters/player/angry.webp` | ok | asset canônico encontrado |
| character-sprite | `player/sad` | `public/assets/characters/player/sad.webp` | ok | asset canônico encontrado |
| character-sprite | `player/surprised` | `public/assets/characters/player/surprised.webp` | ok | asset canônico encontrado |
| character-sprite | `ravi/neutral` | `public/assets/characters/ravi/neutral.webp` | ok | asset canônico encontrado |
| character-sprite | `ravi/smile` | `public/assets/characters/ravi/smile.webp` | ok | asset canônico encontrado |
| character-sprite | `ravi/tease` | `public/assets/characters/ravi/tease.webp` | ok | asset canônico encontrado |
| character-sprite | `ravi/serious` | `public/assets/characters/ravi/serious.webp` | ok | asset canônico encontrado |
| character-sprite | `ravi/blush` | `public/assets/characters/ravi/blush.webp` | ok | asset canônico encontrado |
| character-sprite | `ravi/angry` | `public/assets/characters/ravi/angry.webp` | ok | asset canônico encontrado |
| character-sprite | `ravi/sad` | `public/assets/characters/ravi/sad.webp` | ok | asset canônico encontrado |
| character-sprite | `ravi/surprised` | `public/assets/characters/ravi/surprised.webp` | ok | asset canônico encontrado |
| background | `auditorium` | `public/assets/backgrounds/auditorium.webp` | ok | saída WebP canônica disponível; SVG preservado como fonte |
| background | `cafe` | `public/assets/backgrounds/cafe.webp` | ok | saída WebP canônica disponível; SVG preservado como fonte |
| background | `campus` | `public/assets/backgrounds/campus.webp` | ok | saída WebP canônica disponível; SVG preservado como fonte |
| background | `downtown` | `public/assets/backgrounds/downtown.webp` | missing | fallback de station.svg; arte final ausente |
| background | `festival` | `public/assets/backgrounds/festival.webp` | missing | fallback de festival-night.svg; arte final ausente |
| background | `garden` | `public/assets/backgrounds/garden.webp` | missing | fallback de park.svg; arte final ausente |
| background | `library` | `public/assets/backgrounds/library.webp` | missing | fallback de campus.svg; arte final ausente |
| background | `night` | `public/assets/backgrounds/night.webp` | missing | fallback de festival-night.svg; arte final ausente |
| background | `rain` | `public/assets/backgrounds/rain.webp` | missing | fallback de station.svg; arte final ausente |
| background | `rooftop` | `public/assets/backgrounds/rooftop.webp` | ok | saída WebP canônica disponível; SVG preservado como fonte |
| background | `room` | `public/assets/backgrounds/room.webp` | missing | fallback de studio.svg; arte final ausente |
| background | `studio` | `public/assets/backgrounds/studio.webp` | ok | saída WebP canônica disponível; SVG preservado como fonte |
| cg | `cg_confession` | `public/assets/cg/cg_confession.webp` | missing | fallback de route-confession.svg; arte final ausente |
| cg | `cg_festival` | `public/assets/cg/cg_festival.webp` | missing | fallback de leon-festival.svg; arte final ausente |
| cg | `cg_gael` | `public/assets/cg/cg_gael.webp` | missing | fallback de finale-romance.svg; arte final ausente |
| cg | `cg_intro` | `public/assets/cg/cg_intro.webp` | missing | fallback de finale-aurora.svg; arte final ausente |
| cg | `cg_leon` | `public/assets/cg/cg_leon.webp` | missing | fallback de leon-festival.svg; arte final ausente |
| cg | `cg_library` | `public/assets/cg/cg_library.webp` | missing | fallback de finale-growth.svg; arte final ausente |
| cg | `cg_photo` | `public/assets/cg/cg_photo.webp` | missing | fallback de ravi-lanterns.svg; arte final ausente |
| cg | `cg_rain` | `public/assets/cg/cg_rain.webp` | missing | fallback de route-confession.svg; arte final ausente |
| cg | `cg_ravi` | `public/assets/cg/cg_ravi.webp` | missing | fallback de ravi-auditorium.svg; arte final ausente |
| cg | `cg_rooftop` | `public/assets/cg/cg_rooftop.webp` | missing | fallback de finale-growth.svg; arte final ausente |
| cg | `cg_solo` | `public/assets/cg/cg_solo.webp` | missing | fallback de finale-aurora.svg; arte final ausente |
| cg | `cg_studio` | `public/assets/cg/cg_studio.webp` | missing | fallback de gael-studio.svg; arte final ausente |
| background | `auditorium` | `public/assets/backgrounds/auditorium.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| background | `cafe` | `public/assets/backgrounds/cafe.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| background | `campus` | `public/assets/backgrounds/campus.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| background | `council` | `public/assets/backgrounds/council.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| background | `festival-day` | `public/assets/backgrounds/festival-day.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| background | `festival-night` | `public/assets/backgrounds/festival-night.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| background | `park` | `public/assets/backgrounds/park.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| background | `rooftop` | `public/assets/backgrounds/rooftop.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| background | `station` | `public/assets/backgrounds/station.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| background | `studio` | `public/assets/backgrounds/studio.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| background | `sunrise` | `public/assets/backgrounds/sunrise.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| cg | `finale-aurora` | `public/assets/cg/finale-aurora.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| cg | `finale-growth` | `public/assets/cg/finale-growth.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| cg | `finale-romance` | `public/assets/cg/finale-romance.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| cg | `gael-studio` | `public/assets/cg/gael-studio.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| cg | `leon-festival` | `public/assets/cg/leon-festival.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| cg | `ravi-auditorium` | `public/assets/cg/ravi-auditorium.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| cg | `ravi-lanterns` | `public/assets/cg/ravi-lanterns.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| cg | `route-confession` | `public/assets/cg/route-confession.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| extra | `gael-sheet` | `public/assets/characters/gael-sheet.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| extra | `iris-sheet` | `public/assets/characters/iris-sheet.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| extra | `leon-sheet` | `public/assets/characters/leon-sheet.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| extra | `maya-sheet` | `public/assets/characters/maya-sheet.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| extra | `ravi-sheet` | `public/assets/characters/ravi-sheet.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| extra | `vivi-sheet` | `public/assets/characters/vivi-sheet.svg` | unused | arquivo presente, mas não usado pelo runtime ativo |
| extra | `gael-sheet` | `public/assets/characters/gael-sheet.svg` | unused | asset auxiliar sem referência ativa detectada |
| extra | `iris-sheet` | `public/assets/characters/iris-sheet.svg` | unused | asset auxiliar sem referência ativa detectada |
| extra | `leon-sheet` | `public/assets/characters/leon-sheet.svg` | unused | asset auxiliar sem referência ativa detectada |
| extra | `maya-sheet` | `public/assets/characters/maya-sheet.svg` | unused | asset auxiliar sem referência ativa detectada |
| extra | `ravi-sheet` | `public/assets/characters/ravi-sheet.svg` | unused | asset auxiliar sem referência ativa detectada |
| extra | `vivi-sheet` | `public/assets/characters/vivi-sheet.svg` | unused | asset auxiliar sem referência ativa detectada |
| extra | `background-01` | `public/assets/sheets/backgrounds/background-01.webp` | unused | asset auxiliar sem referência ativa detectada |
| extra | `background-02` | `public/assets/sheets/backgrounds/background-02.webp` | unused | asset auxiliar sem referência ativa detectada |
| extra | `cg-01` | `public/assets/sheets/cg/cg-01.webp` | unused | asset auxiliar sem referência ativa detectada |
| extra | `cg-02` | `public/assets/sheets/cg/cg-02.webp` | unused | asset auxiliar sem referência ativa detectada |
| extra | `gael-sheet` | `public/assets/sheets/characters/gael-sheet.png` | unused | asset auxiliar sem referência ativa detectada |
| extra | `gael-sheet` | `public/assets/sheets/characters/gael-sheet.webp` | unused | asset auxiliar sem referência ativa detectada |
| extra | `leon-sheet` | `public/assets/sheets/characters/leon-sheet.png` | unused | asset auxiliar sem referência ativa detectada |
| extra | `leon-sheet` | `public/assets/sheets/characters/leon-sheet.webp` | unused | asset auxiliar sem referência ativa detectada |
| extra | `maya-sheet` | `public/assets/sheets/characters/maya-sheet.png` | unused | asset auxiliar sem referência ativa detectada |
| extra | `maya-sheet` | `public/assets/sheets/characters/maya-sheet.webp` | unused | asset auxiliar sem referência ativa detectada |
| extra | `player-sheet` | `public/assets/sheets/characters/player-sheet.png` | unused | asset auxiliar sem referência ativa detectada |
| extra | `player-sheet` | `public/assets/sheets/characters/player-sheet.webp` | unused | asset auxiliar sem referência ativa detectada |
| extra | `ravi-sheet` | `public/assets/sheets/characters/ravi-sheet.png` | unused | asset auxiliar sem referência ativa detectada |
| extra | `ravi-sheet` | `public/assets/sheets/characters/ravi-sheet.webp` | unused | asset auxiliar sem referência ativa detectada |
