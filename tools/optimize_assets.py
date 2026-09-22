#!/usr/bin/env python3
"""Converte imagens raster do projeto para WebP, preservando os originais."""
from __future__ import annotations
import argparse
from pathlib import Path
from PIL import Image

def main() -> None:
    parser=argparse.ArgumentParser()
    parser.add_argument("--root", default="public/assets")
    parser.add_argument("--quality", type=int, default=92)
    args=parser.parse_args()
    root=Path(args.root)
    count=0
    for path in root.rglob("*"):
        if path.suffix.lower() not in {".png",".jpg",".jpeg"}:
            continue
        out=path.with_suffix(".webp")
        with Image.open(path) as img:
            img.convert("RGBA" if "A" in img.getbands() else "RGB").save(out,"WEBP",quality=args.quality,method=6)
        count+=1
        print(f"[WEBP] {path} -> {out}")
    print(f"[DONE] {count} arquivo(s) convertido(s).")
if __name__=="__main__":
    main()
