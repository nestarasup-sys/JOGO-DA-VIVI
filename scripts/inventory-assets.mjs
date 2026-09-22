import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(process.env.ASSET_REPO_ROOT || fileURLToPath(new URL('..', import.meta.url)));
const publicAssets = path.join(root, 'public', 'assets');
const activeStoryPath = path.join(root, 'src', 'data', 'season1.json');
const activeTypesPath = path.join(root, 'src', 'game', 'types.ts');
const activeAssetsPath = path.join(root, 'src', 'assets.ts');
const contentPath = path.join(root, 'src', 'data', 'content.ts');
const memoriesPath = path.join(root, 'src', 'game', 'memories.ts');
const deadStoryPath = path.join(root, 'public', 'content', 'story.json');

const expressionOrder = ['neutral', 'smile', 'tease', 'serious', 'blush', 'angry', 'sad', 'surprised'];
const imageExtensions = new Set(['.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif']);
const read = file => fs.readFile(file, 'utf8');
const rel = file => path.relative(root, file).replaceAll('\\', '/');
const add = (set, value) => value && set.add(value);

async function walk(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(file));
    else result.push(file);
  }
  return result;
}

function walkStory(value, refs) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.bg === 'string') add(refs.backgrounds, value.bg);
  if (typeof value.cover === 'string') add(refs.backgrounds, value.cover);
  if (typeof value.unlockCG === 'string') add(refs.cgs, value.unlockCG);
  if (Array.isArray(value.show)) {
    for (const pair of value.show) {
      if (Array.isArray(pair)) {
        add(refs.characters, pair[0]);
        add(refs.expressions, pair[1]);
      }
    }
  }
  for (const child of Object.values(value)) walkStory(child, refs);
}

function stringsFrom(source, pattern) {
  return [...source.matchAll(pattern)].map(match => match[1]);
}

const story = JSON.parse(await read(activeStoryPath));
const [typesSource, assetsSource, contentSource, memoriesSource, deadStorySource] = await Promise.all([
  read(activeTypesPath), read(activeAssetsPath), read(contentPath), read(memoriesPath), read(deadStoryPath)
]);
const refs = { characters: new Set(), expressions: new Set(), backgrounds: new Set(), cgs: new Set() };
walkStory(story, refs);
for (const id of stringsFrom(memoriesSource, /id:'([^']+)'/g)) if (id.startsWith('cg_')) add(refs.cgs, id);
for (const id of stringsFrom(contentSource, /id:'([^']+)'/g)) if (id.startsWith('cg_')) add(refs.cgs, id);
for (const id of stringsFrom(contentSource, /id:'([^']+)'/g)) if (['campus', 'library', 'cafe', 'rooftop', 'garden', 'studio', 'auditorium', 'downtown'].includes(id)) add(refs.backgrounds, id);

const declaredCharacters = stringsFrom(typesSource, /'([a-z]+)'\|?/g).filter(id => ['gael', 'leon', 'ravi', 'maya', 'player', 'vivi', 'iris'].includes(id));
const declaredExpressions = stringsFrom(typesSource, /'([^']+)'\|?/g).filter(id => expressionOrder.includes(id));
for (const id of declaredCharacters) add(refs.characters, id);
for (const id of declaredExpressions) add(refs.expressions, id);
for (const id of stringsFrom(assetsSource, /`\/assets\/backgrounds\/\$\{id\}\.webp`/g)) add(refs.backgrounds, id);

const files = (await walk(publicAssets)).filter(file => imageExtensions.has(path.extname(file).toLowerCase()));
const byCategory = {
  'character-sprite': files.filter(file => rel(file).startsWith('public/assets/characters/') && !path.basename(file).includes('-sheet.')).map(rel),
  background: files.filter(file => rel(file).startsWith('public/assets/backgrounds/')).map(rel),
  cg: files.filter(file => rel(file).startsWith('public/assets/cg/')).map(rel),
  ui: files.filter(file => /(^|\/)ui\//.test(rel(file))).map(rel),
  extra: []
};
byCategory.extra = files.filter(file => !['character-sprite', 'background', 'cg', 'ui'].some(category => byCategory[category].includes(rel(file)))).map(rel);

const sourceCharacterSheets = files.filter(file => rel(file).startsWith('public/assets/characters/') && path.basename(file).includes('-sheet.')).map(rel);
const canonicalCharacters = [...refs.characters].sort();
const canonicalExpressions = expressionOrder.filter(id => refs.expressions.has(id));
const canonicalBackgrounds = [...refs.backgrounds].sort();
const canonicalCgs = [...refs.cgs].sort();
const assetPath = (category, id) => category === 'character-sprite'
  ? `public/assets/characters/${id}/` : `public/assets/${category === 'background' ? 'backgrounds' : category}`;

const entries = [];
const addEntry = (category, id, currentPath, status, notes) => entries.push({ category, id, currentPath, status, notes });
for (const character of canonicalCharacters) {
  const characterFiles = byCategory['character-sprite'].filter(file => file.startsWith(`${assetPath('character-sprite', character)}`));
  for (const expression of canonicalExpressions) {
    const exact = characterFiles.find(file => new RegExp(`/${expression}\\.(png|webp|svg)$`).test(file));
    const fallback = characterFiles.find(file => /\/neutral\.(png|webp|svg)$/.test(file));
    addEntry('character-sprite', `${character}/${expression}`, exact || fallback || `${assetPath('character-sprite', character)}${expression}.webp`, exact ? 'ok' : fallback ? 'missing' : 'missing', exact ? 'asset canônico encontrado' : fallback ? 'expressão não existe na fonte; saída usa fallback documentado' : 'sem fonte para geração');
  }
}
for (const id of canonicalBackgrounds) {
  const matches = byCategory.background.filter(file => new RegExp(`/${id}\\.(png|webp|svg)$`).test(file));
  addEntry('background', id, matches[0] || `public/assets/backgrounds/${id}.webp`, matches.length > 1 ? 'duplicated' : matches.length ? 'ok' : 'missing', matches.length > 1 ? `${matches.length} arquivos candidatos` : matches.length ? 'referenciado pela campanha ou catálogo ativo' : 'referenciado, mas não encontrado');
}
for (const id of canonicalCgs) {
  const matches = byCategory.cg.filter(file => new RegExp(`/${id}\\.(png|webp|svg)$`).test(file));
  addEntry('cg', id, matches[0] || `public/assets/cg/${id}.webp`, matches.length > 1 ? 'duplicated' : matches.length ? 'ok' : 'missing', matches.length > 1 ? `${matches.length} arquivos candidatos` : matches.length ? 'referenciado pela campanha, finais ou galeria' : 'referenciado, mas não encontrado');
}
for (const file of [...byCategory.background, ...byCategory.cg, ...sourceCharacterSheets]) {
  const used = entries.some(entry => entry.currentPath === file);
  if (!used) addEntry(file.startsWith('public/assets/cg/') ? 'cg' : file.startsWith('public/assets/backgrounds/') ? 'background' : 'extra', path.basename(file, path.extname(file)), file, 'unused', 'arquivo presente, mas não usado pelo runtime ativo');
}
for (const file of [...byCategory.ui, ...byCategory.extra]) addEntry(file.startsWith('public/assets/ui/') ? 'ui' : 'extra', path.basename(file, path.extname(file)), file, 'unused', 'asset auxiliar sem referência ativa detectada');

const inventory = {
  generatedAt: new Date().toISOString(),
  sourceOfTruth: { runtime: 'src/store/gameStore.ts -> src/data/season1.json', assetResolver: 'src/assets.ts', excludedArchitecture: 'public/content/story.json + src/screens/*' },
  counts: { characters: canonicalCharacters.length, expressions: canonicalExpressions.length, backgrounds: canonicalBackgrounds.length, cgs: canonicalCgs.length, sheets: canonicalCharacters.length + Math.ceil(canonicalBackgrounds.length / 8) + Math.ceil(canonicalCgs.length / 8) },
  active: { characters: canonicalCharacters, expressions: canonicalExpressions, backgrounds: canonicalBackgrounds, cgs: canonicalCgs },
  declaredButNotActive: ['vivi', 'iris'].filter(id => !refs.characters.has(id) || id === 'vivi' || id === 'iris'),
  sourceCharacterSheets,
  entries,
  files: byCategory,
  deadArchitectureReferences: { storyJsonCharacters: stringsFrom(deadStorySource, /"id":\s*"([a-z]+)"/g), note: 'catalogado apenas como legado; não dirige o runtime ativo' }
};

const outputDir = path.join(root, 'tools', 'generated');
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, 'asset-inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`);

const statusRows = entries.map(entry => `| ${entry.category} | \`${entry.id}\` | \`${entry.currentPath}\` | ${entry.status} | ${entry.notes} |`).join('\n');
const markdown = `# Inventário de Assets\n\nGerado em ${inventory.generatedAt}. Fonte ativa: \`${inventory.sourceOfTruth.runtime}\`; o catálogo legado \`public/content/story.json\` não é carregado pelo app atual.\n\n## Resumo\n\n- Personagens ativos: **${canonicalCharacters.length}** (${canonicalCharacters.join(', ')}).\n- Expressões usadas: **${canonicalExpressions.length}** (${canonicalExpressions.join(', ')}).\n- Backgrounds: **${canonicalBackgrounds.length}**.\n- CGs no catálogo ativo/finais: **${canonicalCgs.length}**.\n- Sheets planejados: **${inventory.counts.sheets}** (${canonicalCharacters.length} personagens + ${Math.ceil(canonicalBackgrounds.length / 8)} backgrounds + ${Math.ceil(canonicalCgs.length / 8)} CGs).\n\n## Inconsistências relevantes\n\n- As fontes SVG de personagens têm 6 células: \`neutral, smile, serious, angry, blush, surprised\]. As expressões \`tease\` e \`sad\` são usadas pela campanha mas não existem como arte-fonte; o pipeline gera saídas fallback e as mantém marcadas como \`missing\`.\n- O runtime usa o id \`player\`, enquanto a sheet legada correspondente se chama \`vivi-sheet.svg\`; a normalização gera \`player/*\` a partir dessa fonte.\n- \`iris\` e as referências do catálogo em \`public/content/story.json\` pertencem à arquitetura paralela/legada e são classificados como não ativos.\n\n## Tabela completa\n\n| Categoria | Asset id | Caminho atual/saída | Status | Observações |\n|---|---|---|---|---|\n${statusRows}\n`;
await fs.mkdir(path.join(root, 'docs'), { recursive: true });
await fs.writeFile(path.join(root, 'docs', 'ASSET_INVENTORY.md'), markdown);
console.log(`Asset inventory: ${entries.length} entries; ${canonicalCharacters.length} characters, ${canonicalBackgrounds.length} backgrounds, ${canonicalCgs.length} CGs; ${inventory.counts.sheets} sheets planned.`);
