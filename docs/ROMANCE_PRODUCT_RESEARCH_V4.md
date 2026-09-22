# Pesquisa de referência e direção de produto — Aurora V4

## Objetivo

Evoluir **Entre Nós: Aurora** como um otome/visual novel original, usando Amor Doce / My Candy Love apenas como referência de gênero e de sistemas, sem copiar personagens, interface, texto, arte ou identidade visual.

## O que faz Amor Doce funcionar

### 1. Romance é o loop central, não uma recompensa lateral
A própria Beemoov descreve My Candy Love como uma experiência episódica em que diálogos e comportamento alteram afinidade e desenvolvimento da história. A progressão é sustentada por:
- escolha de respostas;
- afinidade/love meter;
- personagens com preferências próprias;
- episódios recorrentes;
- imagens especiais;
- replay para explorar alternativas;
- personalização da protagonista.

Fontes:
- https://www.beemoov.com/documents/presse/PressRelease-MyCandyLove-Episode%2021.pdf
- https://www.mycandylove.com/love-life
- https://apps.apple.com/br/app/amor-doce-newgen-otome-game/id1628341404

### 2. O jogador precisa aprender a pessoa, não decorar uma resposta
A graça de um dating sim é conhecer personalidade, valores, humor, inseguranças e limites. Afinidade deve ser consequência de coerência relacional.

Direção Aurora:
- mostrar o estágio da relação;
- não mostrar qual alternativa é a “certa”;
- marcar apenas a intensidade da decisão;
- permitir respostas que expressem personalidade da protagonista;
- construir consequências posteriores, não só +3 imediato.

### 3. Replay tem que oferecer descoberta
No Amor Doce, replay existe para revisitar diálogos, alterar afinidade e desbloquear imagens/possibilidades.

Direção Aurora:
- replay gratuito;
- desbloqueios globais preservados;
- decisões registradas para futura árvore/linha do tempo;
- galeria como memória emocional e não simples coleção;
- finais independentes das CGs já obtidas.

Referência comunitária:
- https://amordoce.fandom.com/wiki/Replay

### 4. Personalidade da protagonista deve ser sistêmica
NewGen trabalha com personalidade dominante que pode mudar conforme escolhas.

Direção Aurora:
- manter Empatia, Coragem e Humor;
- usar traits como condições reais de cenas no futuro;
- desbloquear respostas especiais por personalidade;
- evitar transformar traits em três barras cosméticas.

Referência:
- https://bugigangasdoamordoce.blogspot.com/2024/05/amor-doce-newgen-lancamento-primeiro.html

## O que NÃO copiar

Avaliações recentes de NewGen repetem críticas a:
- gasto agressivo de PA;
- pagar para continuar diálogos;
- pagar mais por cenas românticas;
- progressão interrompida;
- romance insuficiente em um jogo cujo tema principal é romance;
- pouca profundidade de amizades;
- episódios percebidos como desconectados.

Fontes:
- https://apps.apple.com/br/app/amor-doce-newgen-otome-game/id1628341404
- https://apps.apple.com/br/app/amor-doce-newgen-otome-game/id1628341404?see-all=reviews

### Regra de produto Aurora
**A campanha principal nunca deve exigir energia, espera ou compra para continuar.**

Moeda serve para:
- roupas;
- cosméticos;
- extras opcionais;
- decoração futura;
- colecionáveis sem impacto obrigatório na rota.

Romance principal, finais e cenas narrativamente essenciais continuam acessíveis por gameplay.

## Pilares V4

### Vínculo
Faixas propostas:
1. Conhecidos — 0
2. Curiosidade — 15
3. Proximidade — 30
4. Confiança — 50
5. Tensão romântica — 70
6. Vínculo profundo — 85

A interface deve explicar emocionalmente o estágio, não só exibir um número.

### Escolhas
Três níveis comunicados sem spoilers:
- TOM DA CONVERSA
- AFETA RELAÇÕES
- DECISÃO IMPORTANTE

Isso cria tensão sem transformar diálogo em prova de múltipla escolha.

### Celular
Mensagens devem reagir a:
- afinidade;
- rota;
- episódio;
- flags;
- eventos;
- traits.

O celular deve parecer continuação da relação, não menu separado.

### Memórias / CG
Cada CG precisa ter:
- contexto;
- personagem/rota;
- gatilho;
- condição;
- título de memória;
- possibilidade de replay da cena que gerou a CG.

### Amizades
Maya e outros NPCs precisam ter vínculo próprio. Romance não deve consumir todas as cenas sociais.

## Dívida técnica encontrada

O repositório contém dois conjuntos arquiteturais:
- fluxo ativo: `App.tsx` + `pages/*` + `NarrativePlayer` + `useGame`;
- componentes alternativos: `screens/*`, `types/game.ts` e uma implementação de VN mais extensa que atualmente não integra o build ativo.

O código ativo deve ser a fonte de verdade até uma migração deliberada. Componentes mortos não devem receber features isoladas.

## Implementado nesta rodada

- afinidade limitada a 0–100;
- traits limitados a 0–100;
- moeda nunca negativa;
- estágios emocionais de relacionamento;
- progresso até o próximo estágio;
- celular adaptativo por afinidade/rota;
- classificação de impacto das escolhas;
- feedback relacional pós-escolha;
- registro de decisões;
- histórico persistente de diálogo;
- modo Auto funcional;
- clique revela texto antes de avançar;
- CI habilitada para a branch de overhaul.

## Próximas frentes agressivas

1. Consolidar arquitetura morta vs ativa.
2. Criar sistema de condições por trait/afinidade/flag dentro do schema ativo.
3. Transformar telefone em conversas ramificadas reais.
4. Criar “momentos especiais” rejogáveis ligados a CGs.
5. Criar mapa com encontros contextuais, sem grind.
6. Reformular episódios para garantir arco A/B/C e payoff romântico por episódio.
7. Adicionar amizade mensurável com NPCs.
8. Criar achievements narrativos.
9. Criar timeline de decisões no perfil.
10. Testes de regressão para rotas, finais e thresholds.
