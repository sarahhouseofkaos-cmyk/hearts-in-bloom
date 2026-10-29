# Flower textures for "Your own colours"

These scripts draw the roses, hydrangeas and foliage sprigs used by
`src/components/ColourArch.tsx`. Each is rendered in greyscale with a
transparent background, so the site can tint it to any colour a couple picks.

Requires Python 3 with `numpy`, `opencv-python` and `Pillow`.

```sh
cd scripts/flowers
mkdir -p out
python3 rose.py out && python3 hydrangea.py out && python3 foliage.py out
# then convert out/*.png to public/images/flowers/*.webp
```
