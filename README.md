# Entre Nós: Aurora — V3 Ultra

Visual novel/otome original inspirado na estrutura de jogos episódicos de romance, sem reutilizar personagens, textos ou interface de terceiros.

## V3

- React 19 + TypeScript + Vite.
- PWA/offline.
- engine narrativa data-driven em JSON.
- 10 episódios completos.
- rotas de Gael, Leon e Ravi.
- afinidade, traits, flags, eventos, mapa, celular, guarda-roupa e galeria.
- Studio JSON dentro do jogo.
- persistência automática com Zustand.
- pipeline de sprite sheets com `sharp`.
- testes do motor com Vitest.
- build e validação automatizados.
- `INSTALAR_E_ATUALIZAR.bat` instala Git/Node se necessário, atualiza o repo, instala dependências, processa assets, testa, builda e abre o dev server.

## Windows

Coloque `INSTALAR_E_ATUALIZAR.bat` em uma pasta dedicada e execute. Na primeira vez ele clona o repositório; nas próximas, atualiza com `git pull`.

## Desenvolvimento

```bash
npm install
npm run assets:slice
npm run dev
```

Validação completa:

```bash
npm run check
```

## Assets

As folhas fonte ficam em `assets/sheets/` e são descritas por `assets/sheets/manifest.json`. `npm run assets:slice` recorta automaticamente para `public/assets/...` em WebP.

As folhas atuais são placeholders de produção e podem ser substituídas por artes finais sem alterar o motor.
