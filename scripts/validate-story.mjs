import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2] ?? 'public/content/story.json';
const full = path.resolve(process.cwd(), file);
const raw = fs.readFileSync(full, 'utf8');
const story = JSON.parse(raw);
const errors = [];
const warnings = [];

if (story.schemaVersion !== 3) errors.push('schemaVersion precisa ser 3.');
if (!Array.isArray(story.episodes) || story.episodes.length === 0) errors.push('Nenhum episódio encontrado.');

for (const ep of story.episodes ?? []) {
  const nodes = ep.nodes ?? {};
  const ids = new Set(Object.keys(nodes));
  if (!nodes[ep.startNode]) {
    errors.push(`${ep.id}: startNode ${ep.startNode} não existe.`);
    continue;
  }

  let endCount = 0;
  for (const [key, node] of Object.entries(nodes)) {
    if (node.id !== key) errors.push(`${ep.id}/${key}: id interno divergente (${node.id}).`);
    if (node.type === 'end') endCount += 1;
    if (node.next && !ids.has(node.next)) errors.push(`${ep.id}/${key}: next -> ${node.next} inexistente.`);
    if (node.type === 'choice' && (!Array.isArray(node.choices) || node.choices.length === 0)) {
      errors.push(`${ep.id}/${key}: nó choice sem opções.`);
    }
    for (const choice of node.choices ?? []) {
      if (!ids.has(choice.to)) errors.push(`${ep.id}/${key}: choice ${choice.id} -> ${choice.to} inexistente.`);
    }
  }
  if (!endCount) errors.push(`${ep.id}: nenhum node tipo end.`);

  const reachable = new Set();
  const stack = [ep.startNode];
  while (stack.length) {
    const id = stack.pop();
    if (!id || reachable.has(id) || !nodes[id]) continue;
    reachable.add(id);
    const node = nodes[id];
    if (node.next) stack.push(node.next);
    for (const choice of node.choices ?? []) stack.push(choice.to);
  }
  for (const id of ids) {
    if (!reachable.has(id)) warnings.push(`${ep.id}/${id}: nó inalcançável a partir de ${ep.startNode}.`);
  }

  const canReachEnd = (start) => {
    const seen = new Set();
    const q = [start];
    while (q.length) {
      const id = q.pop();
      if (!id || seen.has(id) || !nodes[id]) continue;
      seen.add(id);
      const node = nodes[id];
      if (node.type === 'end') return true;
      if (node.next) q.push(node.next);
      for (const choice of node.choices ?? []) q.push(choice.to);
    }
    return false;
  };
  if (!canReachEnd(ep.startNode)) errors.push(`${ep.id}: nenhum caminho do início chega a um final.`);
}

const publicRoot = path.resolve(process.cwd(), 'public');
const assetRefs = new Set();
const walk = (value) => {
  if (typeof value === 'string' && value.startsWith('/assets/')) assetRefs.add(value);
  else if (Array.isArray(value)) value.forEach(walk);
  else if (value && typeof value === 'object') Object.values(value).forEach(walk);
};
walk(story);
for (const ref of assetRefs) {
  const disk = path.join(publicRoot, ref.replace(/^\//, ''));
  if (!fs.existsSync(disk)) warnings.push(`Asset referenciado ainda não existe: ${ref}`);
}

console.log(`Aurora V3 validator: ${story.episodes?.length ?? 0} episódios, ${assetRefs.size} assets referenciados.`);
for (const warning of warnings) console.warn('WARN:', warning);
if (errors.length) {
  for (const error of errors) console.error('ERROR:', error);
  process.exit(1);
}
console.log(`OK — grafo narrativo válido. ${warnings.length} aviso(s).`);
