# Asset Sheets

O formato canônico é uma sheet 4×2 por personagem, com oito células de 512×768 na ordem `neutral, smile, tease, serious, blush, angry, sad, surprised`. Backgrounds e CGs usam previews 4×2 de até oito itens por página, em thumbnails 640×360 e com rótulo.

O inventário recalcula os nomes e a quantidade de sheets em cada execução. No estado atual são 5 sheets de personagens, 2 de backgrounds e 2 de CGs: 9 ao todo.

Execute `npm run assets:rebuild-all` depois de trocar uma fonte. O manifest em `public/assets/sheets/manifest.json` descreve células, coordenadas, fontes e fallbacks.
