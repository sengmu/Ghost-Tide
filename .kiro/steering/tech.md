---
inclusion: always
---
# Tech stack

- **Vite** (dev server + build), **vanilla ES modules**, **Canvas 2D**. No framework, no game engine.
- Fonts: `@fontsource/creepster` and `@fontsource/im-fell-english-sc` (SIL Open Font License), bundled locally - no runtime CDN.
- Audio: Web Audio API, synthesised at runtime (no audio files).
- Art: procedural canvas drawing, CSS gradients and inline SVG only. No bitmap assets.
- Tests: **Vitest** for pure logic in `src/game.js`, `src/tides.js`, `src/geometry.js`.
- Smoke test: `scripts/screenshot.mjs` (Playwright, 914x411, DPR 2.625) - fails on any console error.

## Conventions
- Simulation (`game.js`) must not touch the DOM so it stays unit-testable. Rendering lives in `render.js`, DOM/HUD in `main.js`.
- Delta-time is clamped to 50 ms. All tuning constants are exported (`BEAM`, `KEEPER`, `FLARE`, `GHOST_TYPES`, `TIDES`).
- Keep the gzipped JS bundle under 15 kB.
- Commands: `npm install`, `npm run dev`, `npm test`, `npm run build`.
