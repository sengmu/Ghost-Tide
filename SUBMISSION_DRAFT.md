# Kiroween 2026 Submission Draft: Ghost Tide

> Internal draft. Before submitting, replace every `[TODO]`, and make sure the Kiro write-up only claims what was really done inside Kiro IDE.

## Project title
**Ghost Tide**

## Tagline
Five tides of the drowned. One lantern. Not enough oil.

## Category
**Costume Contest**: a haunting, polished horror UI.

## Links
- Repository: `[TODO public repo URL, MIT license visible at the top level]`
- Playable build: `[TODO e.g. GitHub Pages / Netlify URL, open on a phone in landscape]`
- Demo video: `[TODO YouTube/Vimeo URL, about 3 minutes]`

## Description
**Ghost Tide** is a short Halloween horror game built for phones held sideways. You play the last keeper of a lighthouse on a cursed island. As night falls, the sea gives back its drowned dead in five rising tides.

- **The lantern is everything.** Drag your right thumb to sweep a cone of warm light. Ghosts caught in it are revealed, slowed and banished. But the lantern burns oil. Run dry and it sputters out, leaving you in a darkness where only their eyes are visible.
- **Escalating tides.**
  - Wisps drift in first.
  - Then tanky shades crawl out of the kelp.
  - Then banshees zig-zag across the reef.
  - On the fifth tide the Drowned Keeper returns: a wraith boss with a health ring that summons more dead.
  - Two flares per tide are your panic button.
- **The costume.**
  - The UI itself is haunted: a flickering Creepster title, drifting fog layers, and a vignette that pulses blood-red when a ghost touches you.
  - Screen shake, SVG hearts and an ember oil gauge.
  - Every pixel is drawn procedurally on Canvas2D. Every sound (the drone, the wind, the wails, the chime of a banished soul) is synthesised live with Web Audio. There are no image or audio files.
- **Mobile-first by rule.**
  - The reference viewport is 914x411.
  - Controls sit at least 24 px from every edge, with safe-area insets respected.
  - Every touch target is at least 44 px and all text is at least 12 px.
  - There are no keyboard or mouse prompts, and portrait shows a "turn your phone" screen.
  - An automated Playwright audit checks these rules on every smoke run.

Built with Vite, vanilla JavaScript, Canvas2D and Web Audio. The JS is about 8 kB gzipped. MIT licensed.

## How we used Kiro
`[TODO: confirm each bullet after doing it in Kiro IDE; delete anything you did not actually do]`

- **Spec-driven development**: `.kiro/specs/ghost-tide/` holds:
  - `requirements.md`: six user stories with EARS acceptance criteria.
  - `design.md`: the architecture, interfaces, the darkness-mask lighting and the test strategy.
  - `tasks.md`: the plan, traced to requirement IDs.

  Kiro executed the tasks one by one. The EARS criterion "WHEN oil reaches zero THE SYSTEM SHALL switch the beam off" became a unit test that caught a real one-frame bug.
- **Steering**: `product.md`, `tech.md` and `structure.md` are always included. They hold the hard mobile rules (24/44/12 px, landscape only, no keyboard or mouse prompts) and the module boundary that keeps the simulation DOM-free, so every agent turn respects them.
- **Agent hooks**:
  - `test-on-save`: runs Vitest when simulation code changes.
  - `mobile-ui-guard`: an agent prompt that re-audits UI rule compliance when HTML, CSS or `main.js` changes.
  - `build-on-stop`: runs the production build at the end of each agent turn.
- **Vibe coding vs. spec**:
  - The spec covered the game rules, where precision mattered.
  - Vibe-coding sessions covered the "costume": fog, flicker timing, ghost silhouettes, palette and synth audio.
  - Vibe coding was faster for taste-driven visuals. The spec was safer for rules that needed tests.
- **MCP**: `[TODO only if used: e.g. a browser/Playwright MCP server so the agent could screenshot the game at 914x411 and read console errors]`
- **Powers**: `[TODO only if used]`

## 3-minute demo video script
| Time | Visual | Voice-over / caption |
|---|---|---|
| 0:00-0:15 | Black screen. Fog fades in, then the flickering GHOST TIDE title. A phone held in landscape. | "The sea gives back what it drowned. Tonight, you keep the light." |
| 0:15-0:35 | Tap "Light the Lantern". The Tide I banner. Pull back to show the thumbs on both sticks. | "Ghost Tide is a horror mini-game made for phones. The left thumb walks, the right thumb sweeps the lantern." |
| 0:35-1:00 | Ghost eyes in the dark, then the beam reveals the bodies, which burst into particles. The oil gauge drops. | "In the dark you only see their eyes. Light reveals them, slows them and banishes them, but every second burns oil." |
| 1:00-1:20 | The oil runs dry, the lantern sputters, the ghosts close in, a flare goes off. | "Run dry and you're blind. Flares are your last resort: two per tide." |
| 1:20-1:40 | Tides III-IV: banshees zig-zagging, the red vignette pulse and screen shake on a hit. | "Every tide is worse. Banshees weave, shades soak up light, and every touch costs a heart." |
| 1:40-2:00 | Tide V: the Drowned Keeper wraith with its health ring, summoning wisps. Win, then the "Dawn" screen. | "On the fifth tide, the Drowned Keeper returns." |
| 2:00-2:40 | Screen capture of Kiro IDE: `requirements.md` (EARS), `tasks.md` being executed, steering files, a hook firing `npm test` on save. | "We built it with Kiro. A spec for the rules, steering for the mobile UI constraints, and hooks that test on every save and build on every stop." |
| 2:40-3:00 | The Playwright audit output (0 errors, 0 layout violations), the screenshot, then the title card with the repo URL and the MIT license. | "Every pixel and sound is procedural. Open source, MIT. Keep the light burning." |

## Blog post draft
**Title:** Building a haunted UI in 8 kB: Ghost Tide for Kiroween 2026

*This post was written for the Kiroween 2026 hackathon.*

For Kiroween I wanted a project where the interface itself was the costume. Ghost Tide is a five-minute horror game for phones in landscape. You're a lighthouse keeper sweeping a lantern across a cursed island while the drowned rise in five tides.

**Darkness as a mechanic.** The whole scene is drawn under an almost-black mask on a second canvas. Light is subtracted from it with `destination-out` gradients: the keeper's aura, the lantern cone, flare rings, and a slow decorative sweep from the lighthouse lens. Ghost bodies are drawn under the mask, so they only exist where light is. Their eyes are drawn over it with additive blending, so you always see them watching. Oil is limited, and that turns "should I light this?" into the core decision.

**A UI that haunts.**
- The title uses the open-licensed Creepster font with a CSS flicker that kills the glow for a few frames, like a failing bulb.
- Two blurred fog layers drift in opposite directions.
- A hit pulses the vignette blood-red and shakes the screen.
- Even the audio is part of the costume. A detuned sawtooth drone and filtered noise surf are synthesised live, with a vibrato wail for each new tide. There isn't a single asset file in the repo.

**Mobile rules as code.** The game targets a 914x411 landscape phone. Instead of trusting my eyes, a Playwright script renders the build at that size and DPR. It fails on any console error and audits that every button is at least 44 px, sits at least 24 px from the edges, and that no text is under 12 px.

**How Kiro helped.** `[TODO: rewrite from your real experience]`
- I wrote the game rules as a Kiro spec with EARS acceptance criteria. Those turned almost one-to-one into Vitest tests, and one of them caught a bug where the lantern stayed lit for a frame after running dry.
- Steering files kept the mobile constraints in front of the agent on every turn.
- Hooks ran tests on save and the build on stop.
- For the visual "costume", vibe coding was the better tool: fast, taste-driven iteration.

Play it on your phone, sideways, with the sound on: `[TODO playable URL]`. Code (MIT): `[TODO repo URL]`.

## Social post draft
#KiroweenHackathon26 🎃 Ghost Tide: five tides of the drowned, one lantern, not enough oil. A haunted horror mini-game for phones in landscape. Every pixel and sound is procedural, built spec-first with @kirodotdev. Play: [TODO URL] · Code (MIT): [TODO URL]
