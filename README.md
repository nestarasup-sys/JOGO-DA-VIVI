# Entre Nós: Aurora — V3 Ultra

Visual novel/otome original em HTML5 moderno. Inspirada no **formato** de jogos episódicos de romance, mas com universo, personagens, arte-base, sistemas e narrativa próprios.

## Rodar no Windows sem configurar nada

Baixe apenas `AURORA_SETUP_UPDATE_RUN.bat` para uma pasta dedicada e execute.

Ele:
1. instala Git, Node LTS e Python se necessário;
2. clona/atualiza este repositório;
3. instala dependências;
4. instala as ferramentas de assets;
5. valida a campanha;
6. compila;
7. abre o servidor local.

Depois, dentro do projeto, `START_AURORA.bat` inicia rapidamente.

## Desenvolvimento manual

```bash
npm install
npm run validate:story
npm run dev
```

Build:

```bash
npm run build
```

## V3 Ultra

- 10 episódios.
- 3 rotas românticas: Gael, Leon e Ravi.
- Afinidade + Empatia/Coragem/Humor.
- Route-lock, CGs e conquistas.
- Celular/mensagens.
- Mapa e calendário.
- Eventos.
- Guarda-roupa e Lúmens.
- Galeria.
- Auto Mode + histórico.
- Save automático + 3 slots + export/import.
- Aurora Studio: editor JSON dentro do jogo.
- PWA.
- Assets offline.
- GitHub Actions.
- Pipeline de character sheets → sprites/WebP.

## Estrutura

```text
src/
  components/
  engine/
  hooks/
  screens/
  store/
  types/
public/
  assets/
  content/story.json
tools/
scripts/
docs/
.github/workflows/
```

Leia:
- [Arquitetura](docs/ARCHITECTURE.md)
- [Pipeline de assets](docs/ASSET_PIPELINE.md)
- [Story Schema V3](docs/STORY_SCHEMA.md)
- [Escopo da V3 Ultra](docs/V3_ULTRA_SCOPE.md)

## Assets

Os SVGs atuais são concept assets originais e totalmente funcionais. A estrutura foi feita para trocar cada um por PNG/WebP final em estilo manhwa/anime sem alterar o motor.

## Repositório

Branch principal: `main`.
