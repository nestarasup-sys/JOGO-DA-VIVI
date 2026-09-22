import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(process.env.ASSET_REPO_ROOT || fileURLToPath(new URL('..', import.meta.url)));
const inventory = JSON.parse(await fs.readFile(path.join(root, 'tools', 'generated', 'asset-inventory.json'), 'utf8'));
const expr = ['neutral', 'smile', 'tease', 'serious', 'blush', 'angry', 'sad', 'surprised'];
const read = file => fs.readFile(path.join(root, file));
const exists = async file => { try { await fs.access(path.join(root, file)); return true; } catch { return false; } };
const sheetManifest = { version: 1, cellSize: { character: { width: 512, height: 768 }, preview: { width: 640, height: 360 } }, sheets: [] };
let fallbackManifest = { characters: {}, backgrounds: {}, cgs: {} };
try { fallbackManifest = JSON.parse(await fs.readFile(path.join(root, 'tools', 'generated', 'asset-fallbacks.json'), 'utf8')); } catch { /* first generation */ }

async function renderSvg(file, width, height) { return sharp(await read(file)).resize(width, height, { fit: 'cover' }).png().toBuffer(); }
async function label(text, width, height = 44) { return Buffer.from(`<svg width="${width}" height="${height}"><rect width="100%" height="100%" fill="#0c0914cc"/><text x="20" y="29" fill="white" font-family="Arial" font-size="18" font-weight="700">${text.replaceAll('&', '&amp;')}</text></svg>`); }
async function write(file, buffer) { await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true }); await fs.writeFile(path.join(root, file), buffer); }

const sourceByCharacter = { player: 'public/assets/characters/vivi-sheet.svg', gael: 'public/assets/characters/gael-sheet.svg', leon: 'public/assets/characters/leon-sheet.svg', ravi: 'public/assets/characters/ravi-sheet.svg', maya: 'public/assets/characters/maya-sheet.svg' };
const sourceOrder = ['neutral', 'smile', 'serious', 'angry', 'blush', 'surprised'];
for (const character of inventory.active.characters) {
  const source = sourceByCharacter[character];
  const aiSource = `tools/generated/ai-character-sheets/${character}-sheet.png`;
  if (await exists(aiSource)) {
    const out = `public/assets/sheets/characters/${character}-sheet.webp`;
    await write(out, await sharp(await read(aiSource)).webp({ quality: 94, alphaQuality: 100, lossless: true }).toBuffer());
    sheetManifest.sheets.push({ category: 'characters', id: character, file: out, columns: 4, rows: 2, items: expr.map((expression, index) => ({ id: expression, x: index % 4 * 512, y: Math.floor(index / 4) * 768, width: 512, height: 768, source: expression, status: 'ai-generated' })) });
    continue;
  }
  if (!source || !(await exists(source))) continue;
  const sourceMeta = await sharp(await read(source)).metadata();
  const cellW = Math.floor(sourceMeta.width / 6);
  const canonical = {};
  for (const expression of expr) {
    const sourceExpression = sourceOrder.includes(expression) ? expression : expression === 'tease' ? 'smile' : 'serious';
    const left = sourceOrder.indexOf(sourceExpression) * cellW;
    const buffer = await sharp(await read(source)).extract({ left, top: 0, width: cellW, height: sourceMeta.height }).resize(512, 768, { fit: 'fill' }).webp({ quality: 92, alphaQuality: 100 }).toBuffer();
    const out = `public/assets/characters/${character}/${expression}.webp`;
    await write(out, buffer);
    canonical[expression] = { out, sourceExpression, status: sourceExpression === expression ? 'ok' : 'fallback' };
  }
  const composites = [];
  for (const expression of expr) {
    const buffer = await sharp(await read(canonical[expression].out)).resize(512, 768).png().toBuffer();
    const tag = await label(`${character.toUpperCase()} · ${expression}${canonical[expression].status === 'fallback' ? ' · FALLBACK' : ''}`, 512);
    composites.push({ input: buffer, top: Math.floor(expr.indexOf(expression) / 4) * 768, left: (expr.indexOf(expression) % 4) * 512 });
    composites.push({ input: tag, top: Math.floor(expr.indexOf(expression) / 4) * 768 + 724, left: (expr.indexOf(expression) % 4) * 512 });
  }
  const out = `public/assets/sheets/characters/${character}-sheet.webp`;
  await write(out, await sharp({ create: { width: 2048, height: 1536, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composites).webp({ quality: 92, alphaQuality: 100 }).toBuffer());
  sheetManifest.sheets.push({ category: 'characters', id: character, file: out, columns: 4, rows: 2, items: expr.map((expression, index) => ({ id: expression, x: index % 4 * 512, y: Math.floor(index / 4) * 768, width: 512, height: 768, source: canonical[expression].sourceExpression, status: canonical[expression].status })) });
}

async function buildPreview(category, ids, sourceDir, outputDir) {
  const aliases = category === 'background'
    ? { library: 'campus.svg', garden: 'park.svg', room: 'studio.svg', rain: 'station.svg', downtown: 'station.svg', night: 'festival-night.svg', festival: 'festival-night.svg' }
    : { cg_intro: 'finale-aurora.svg', cg_rain: 'route-confession.svg', cg_rooftop: 'finale-growth.svg', cg_festival: 'leon-festival.svg', cg_library: 'finale-growth.svg', cg_studio: 'gael-studio.svg', cg_photo: 'ravi-lanterns.svg', cg_confession: 'route-confession.svg', cg_gael: 'finale-romance.svg', cg_leon: 'leon-festival.svg', cg_ravi: 'ravi-auditorium.svg', cg_solo: 'finale-aurora.svg' };
  for (let offset = 0, page = 1; offset < ids.length; offset += 8, page++) {
    const chunk = ids.slice(offset, offset + 8);
    const composites = [];
    for (const [index, id] of chunk.entries()) {
      let source = inventory.entries.find(entry => entry.category === category && entry.id === id)?.currentPath;
      const previousFallback = fallbackManifest[category === 'background' ? 'backgrounds' : 'cgs']?.[id];
      if (previousFallback && previousFallback !== 'missing-placeholder') source = `public/assets/${sourceDir}/${previousFallback}`;
      if (!source || !(await exists(source))) {
        const fallback = aliases[id];
        source = fallback ? `public/assets/${sourceDir}/${fallback}` : null;
        if (fallback) fallbackManifest[category === 'background' ? 'backgrounds' : 'cgs'][id] = fallback;
      }
      if (!source || !(await exists(source))) {
        source = `tools/generated/missing-${category}.svg`;
        await write(source, Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="100%" height="100%" fill="#261c32"/><text x="80" y="540" fill="#fff" font-family="Arial" font-size="64">MISSING · ${id}</text></svg>`));
        fallbackManifest[category === 'background' ? 'backgrounds' : 'cgs'][id] = 'missing-placeholder';
      }
      const canonical = `public/assets/${sourceDir}/${id}.webp`;
      const sourceBuffer = await sharp(await read(source)).png().toBuffer();
      await write(canonical, await sharp(sourceBuffer).webp({ quality: 92, alphaQuality: 100 }).toBuffer());
      const thumb = await renderSvg(source, 640, 360);
      const tag = await label(id, 640);
      composites.push({ input: thumb, left: index % 4 * 640, top: Math.floor(index / 4) * 360 });
      composites.push({ input: tag, left: index % 4 * 640, top: Math.floor(index / 4) * 360 + 316 });
    }
    const out = `public/assets/sheets/${outputDir}/${category}-${String(page).padStart(2, '0')}.webp`;
    await write(out, await sharp({ create: { width: 2560, height: 720, channels: 4, background: { r: 12, g: 9, b: 20, alpha: 1 } } }).composite(composites).webp({ quality: 90 }).toBuffer());
    sheetManifest.sheets.push({ category: outputDir, page, file: out, columns: 4, rows: 2, items: chunk.map((id, index) => ({ id, x: index % 4 * 640, y: Math.floor(index / 4) * 360, width: 640, height: 360 })) });
  }
}
await buildPreview('background', inventory.active.backgrounds, 'backgrounds', 'backgrounds');
await buildPreview('cg', inventory.active.cgs, 'cg', 'cg');
fallbackManifest.characters = Object.fromEntries(inventory.active.characters.map(character => [character, { tease: 'smile', sad: 'serious' }]));
await write('tools/generated/asset-fallbacks.json', Buffer.from(`${JSON.stringify(fallbackManifest, null, 2)}\n`));
await write('tools/generated/asset-sheets-manifest.json', Buffer.from(`${JSON.stringify(sheetManifest, null, 2)}\n`));
await write('public/assets/sheets/manifest.json', Buffer.from(`${JSON.stringify(sheetManifest, null, 2)}\n`));
console.log(`Asset sheets built: ${sheetManifest.sheets.length}`);
