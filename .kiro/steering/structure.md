---
inclusion: always
---
# Project structure

```
index.html            DOM shell: canvas, fog layers, HUD, touch controls, screens
src/main.js           bootstrap, wiring of screens/HUD/input to Game + Renderer
src/game.js           simulation: keeper, beam/oil, ghosts, tides, flare, win/lose
src/tides.js          data: ghost types and the five tides
src/geometry.js       pure math: cone hit test, ellipse clamp, seeded RNG
src/render.js         Canvas2D renderer: sea, island, lighthouse, ghosts, darkness mask, FX
src/input.js          virtual thumb-sticks (Pointer Events) and tap helper
src/audio.js          procedural Web Audio drone and SFX
src/style.css         horror UI theme, safe-area layout, animations
tests/*.test.js       Vitest unit tests
scripts/screenshot.mjs headless smoke test + layout audit
.kiro/                steering, specs and hooks for Kiro
```

New gameplay data goes in `tides.js`; new math goes in `geometry.js` with a test.
