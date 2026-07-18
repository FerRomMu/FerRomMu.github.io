#!/usr/bin/env python3
"""Resize + center-crop every image in input/ to 800x480 (5:3) WebP in img/."""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "input"
DST = ROOT / "img"
W, H = 800, 480
INK = (23, 21, 18)
PAPER = (236, 232, 224)
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff"}


def main():
    SRC.mkdir(exist_ok=True)
    DST.mkdir(exist_ok=True)
    files = sorted(p for p in SRC.iterdir() if p.suffix.lower() in EXTS)
    if not files:
        print(f"no images found in {SRC}")
        return
    for p in files:
        try:
            im = Image.open(p)
            im = ImageOps.exif_transpose(im)
            im = im.convert("RGBA")
            im = Image.alpha_composite(Image.new("RGBA", im.size, PAPER + (255,)), im)
            im = ImageOps.fit(im.convert("RGB"), (W, H), Image.Resampling.LANCZOS)
            gray = ImageOps.autocontrast(im.convert("L"), cutoff=1)
            im = ImageOps.colorize(gray, black=INK, white=PAPER)
            out = DST / (p.stem + ".webp")
            im.save(out, "WEBP", quality=80, method=6)
            print(f"ok   {p.name} -> {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)")
        except Exception as e:
            print(f"FAIL {p.name}: {e}")


if __name__ == "__main__":
    main()
