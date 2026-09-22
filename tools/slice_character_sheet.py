#!/usr/bin/env python3
"""Recorta folhas de personagem em sprites individuais e WebP otimizados.

Exemplo:
python tools/slice_character_sheet.py ^
  --input tools/incoming/gael_sheet.png ^
  --character gael --cols 3 --rows 2 ^
  --names neutral,smile,serious,angry,blush,surprised ^
  --trim
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from PIL import Image, ImageChops


def trim_alpha(image: Image.Image) -> Image.Image:
    if image.mode != "RGBA":
        image = image.convert("RGBA")
    alpha = image.getchannel("A")
    box = alpha.getbbox()
    return image.crop(box) if box else image


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--character", required=True)
    parser.add_argument("--cols", type=int, required=True)
    parser.add_argument("--rows", type=int, required=True)
    parser.add_argument("--names", required=True, help="nomes separados por vírgula, na ordem da folha")
    parser.add_argument("--output", default="public/assets/characters")
    parser.add_argument("--trim", action="store_true")
    parser.add_argument("--quality", type=int, default=94)
    args = parser.parse_args()

    src = Path(args.input)
    if not src.exists():
        raise SystemExit(f"Arquivo não encontrado: {src}")

    names = [name.strip() for name in args.names.split(",") if name.strip()]
    expected = args.cols * args.rows
    if len(names) != expected:
        raise SystemExit(f"Esperava {expected} nomes, recebeu {len(names)}.")

    image = Image.open(src).convert("RGBA")
    if image.width % args.cols or image.height % args.rows:
        raise SystemExit("A largura/altura da folha precisa ser divisível por cols/rows.")

    cell_w = image.width // args.cols
    cell_h = image.height // args.rows
    out_dir = Path(args.output) / args.character
    out_dir.mkdir(parents=True, exist_ok=True)

    manifest = {"character": args.character, "source": src.name, "sprites": {}}
    for index, name in enumerate(names):
        col = index % args.cols
        row = index // args.cols
        crop = image.crop((col * cell_w, row * cell_h, (col + 1) * cell_w, (row + 1) * cell_h))
        if args.trim:
            crop = trim_alpha(crop)
        png_path = out_dir / f"{name}.png"
        webp_path = out_dir / f"{name}.webp"
        crop.save(png_path, optimize=True)
        crop.save(webp_path, "WEBP", quality=args.quality, method=6, lossless=False)
        manifest["sprites"][name] = {
            "png": png_path.as_posix(),
            "webp": webp_path.as_posix(),
            "width": crop.width,
            "height": crop.height,
        }
        print(f"[OK] {name}: {crop.width}x{crop.height}")

    manifest_path = out_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[DONE] Manifesto: {manifest_path}")


if __name__ == "__main__":
    main()
