import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(process.env.ASSET_REPO_ROOT || fileURLToPath(new URL('..', import.meta.url)));
const inputDir = path.join(root, 'tools', 'incoming', 'ai-character-sheets');
const outputDir = path.join(root, 'tools', 'generated', 'ai-character-sheets');
const characters = ['gael', 'leon', 'ravi', 'maya', 'player'];
const expressions = ['neutral', 'smile', 'tease', 'serious', 'blush', 'angry', 'sad', 'surprised'];
const width = 512;
const height = 768;

async function exists(file) { try { await fs.access(file); return true; } catch { return false; } }
async function write(file, buffer) { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, buffer); }

function removeConnectedBackground(raw, w, h) {
  const pixels = raw.data;
  const visited = new Uint8Array(w * h);
  const queue = [];
  const index = (x, y) => y * w + x;
  const colorDistance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const rgb = i => [pixels[i * 4], pixels[i * 4 + 1], pixels[i * 4 + 2]];
  const push = (x, y) => { const i = index(x, y); if (!visited[i]) { visited[i] = 1; queue.push([x, y]); } };
  for (let x = 0; x < w; x++) push(x, 0);
  for (let y = 1; y < h; y++) { push(0, y); push(w - 1, y); }
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const [x, y] = queue[cursor];
    const current = rgb(index(x, y));
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = index(nx, ny);
      if (!visited[ni] && colorDistance(current, rgb(ni)) <= 34) push(nx, ny);
    }
  }
  for (let i = 0; i < visited.length; i++) if (visited[i]) pixels[i * 4 + 3] = 0;
  return raw;
}

const manifest = { version: 1, source: 'AI-generated 4x2 sheets', cell: { width, height }, characters: {} };
for (const character of characters) {
  const input = path.join(inputDir, `${character}-sheet.png`);
  if (!(await exists(input))) throw new Error(`Sheet AI ausente: ${input}`);
  const meta = await sharp(input).metadata();
  const cellW = Math.floor(meta.width / 4);
  const cellH = Math.floor(meta.height / 2);
  if (cellW <= 0 || cellH <= 0) throw new Error(`Dimensões inválidas para ${character}: ${meta.width}x${meta.height}`);
  const cells = [];
  for (let i = 0; i < expressions.length; i++) {
    const raw = await sharp(input).extract({ left: (i % 4) * cellW, top: Math.floor(i / 4) * cellH, width: cellW, height: cellH }).resize(width, height, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const clean = removeConnectedBackground(raw, width, height);
    const cell = await sharp(clean.data, { raw: { width, height, channels: 4 } }).png().toBuffer();
    cells.push(cell);
    await write(path.join(root, 'public', 'assets', 'characters', character, `${expressions[i]}.webp`), await sharp(cell).webp({ quality: 94, alphaQuality: 100, lossless: true }).toBuffer());
  }
  const composite = cells.map((cell, i) => ({ input: cell, left: (i % 4) * width, top: Math.floor(i / 4) * height }));
  const sheet = await sharp({ create: { width: width * 4, height: height * 2, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composite).png().toBuffer();
  await write(path.join(outputDir, `${character}-sheet.png`), sheet);
  await write(path.join(root, 'public', 'assets', 'sheets', 'characters', `${character}-sheet.png`), sheet);
  manifest.characters[character] = { input: path.relative(root, input).replaceAll('\\', '/'), output: `tools/generated/ai-character-sheets/${character}-sheet.png`, expressions };
  console.log(`Imported AI sheet ${character}: ${expressions.length} expressions`);
}
await write(path.join(root, 'tools', 'generated', 'ai-character-manifest.json'), Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`));

const fallbackFile = path.join(root, 'tools', 'generated', 'asset-fallbacks.json');
let fallback = { characters: {}, backgrounds: {}, cgs: {} };
if (await exists(fallbackFile)) fallback = JSON.parse(await fs.readFile(fallbackFile, 'utf8'));
fallback.characters = {};
await write(fallbackFile, Buffer.from(`${JSON.stringify(fallback, null, 2)}\n`));
