import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(process.env.ASSET_REPO_ROOT || fileURLToPath(new URL('..', import.meta.url)));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'tools', 'generated', 'asset-sheets-manifest.json'), 'utf8'));
const sheets = manifest.sheets.filter(sheet => sheet.category === 'characters');
for (const sheet of sheets) {
  const source = sharp(path.join(root, sheet.file));
  for (const item of sheet.items) {
    const out = path.join(root, 'public', 'assets', 'characters', sheet.id, `${item.id}.webp`);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await source.clone().extract({ left: item.x, top: item.y, width: item.width, height: item.height }).webp({ quality: 92, alphaQuality: 100 }).toFile(out);
  }
  console.log(`Sliced ${sheet.id}: ${sheet.items.length} cells`);
}
