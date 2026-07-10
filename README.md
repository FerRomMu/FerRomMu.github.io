# Fernando Romero — Portfolio PoC

Single-page portfolio with horizontal-scroll navigation. Plain HTML/CSS/vanilla JS — no frameworks, no build step, no animation libraries.

## Run

Open `index.html` directly, or serve it:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

Fonts (Fraunces + JetBrains Mono) load from Google Fonts, so an internet connection is needed for full fidelity.

## Interaction

- **Wheel / trackpad** — vertical input drives horizontal travel with hand-rolled inertia (RAF lerp)
- **Keyboard** — arrows, PageUp/Down, Space, Home/End
- **Drag** — pointer drag on the track
- **Nav bar** — jumps to sections, tracks the active one
- Live HUD: `POS` scroll readout (0.000–1.000), section counter, ruler progress indicator
- `prefers-reduced-motion` disables inertia, glitch accents, and reveals
- Below 900px (or without JS) the page falls back to a vertical stack

## Structure

```
index.html      markup, hero vesica SVG
css/style.css   visual system: paper/ink palette, golden-ratio spacing, glitch accents
js/main.js      scroll engine, HUD, reveals, clock
docs/           original design prompt
references/     visual reference screenshots
```
