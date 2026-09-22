# Story JSON — Schema V3

Arquivo principal: `public/content/story.json`.

## Episode

```json
{
  "id": "ep01",
  "number": 1,
  "title": "Título",
  "startNode": "start",
  "nodes": {}
}
```

## Dialogue

```json
{
  "id": "n1",
  "type": "dialogue",
  "speaker": "Gael",
  "text": "Olá, {player}.",
  "background": "/assets/backgrounds/campus.svg",
  "character": "gael",
  "expression": "serious",
  "next": "n2"
}
```

## Choice

Cada opção pode ter `conditions` e `effects`.

Efeitos atuais: `affinity`, `trait`, `currency`, `flag`, `unlockCg`, `unlockOutfit`, `message`, `route`, `achievement`, `advanceTime`.

Condições atuais: `flag`, `affinity`, `trait`, `route`, `lumens`, `episodeComplete`.

## Regra de ouro

IDs de nodes são estáveis. Nunca reutilize o mesmo ID para outra cena depois que saves públicos existirem.
