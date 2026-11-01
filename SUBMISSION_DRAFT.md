# Kiroween 2026 Submission Draft: Ghost Tide

> Internal draft for Kiroween 2026. Repo and playable URLs are filled in. Remaining `[TODO]`s: YouTube/Vimeo upload, and rewriting the Kiro section after a real Kiro IDE re-run. Do not claim Kiro generated the game until that re-run is done.

## Project title
**Ghost Tide**

## Tagline
Five tides of the drowned. One lantern. Not enough oil.

## Category
**Costume Contest**: a haunting, polished horror UI.

## Links
- Repository: https://github.com/sengmu/Ghost-Tide (MIT license at the top level)
- Playable build: https://sengmu.github.io/Ghost-Tide/ (open on a phone in landscape)
- Demo video: `[TODO YouTube/Vimeo URL]` — local silent gameplay capture is ready at `ghost-tide-demo.mp4` (~19.6 MB, 112.8 s, 1828x822, H.264, no audio; segment notes in `ghost-tide-demo-notes.md`). Upload that file (or a cut with voice-over) to YouTube/Vimeo, then paste the public URL here. Suggested title: **Ghost Tide — Kiroween 2026 Costume Contest**. Description paste: see the social draft below.

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
> **Honest status (do not submit as-is):** the `.kiro/` specs, steering and hooks in this repo were **authored outside Kiro IDE** as the intended Kiroween workflow. They are committed on purpose so a judge (or you) can open the repo in Kiro, regenerate or refine the spec there, let the hooks fire for real, and then rewrite the bullets below to match what actually happened inside Kiro. Do **not** claim Kiro generated the game or ran these hooks until that re-run is done.

**Ready-to-edit bullets** (after you re-run in Kiro IDE, keep only what you really did):

- **Spec-driven development**: `.kiro/specs/ghost-tide/` holds:
  - `requirements.md`: six user stories with EARS acceptance criteria.
  - `design.md`: the architecture, interfaces, the darkness-mask lighting and the test strategy.
  - `tasks.md`: the plan, traced to requirement IDs.

  `[TODO after Kiro re-run]` Example claim once true: Kiro executed the tasks one by one; the EARS criterion "WHEN oil reaches zero THE SYSTEM SHALL switch the beam off" became a unit test that caught a real one-frame bug.
- **Steering**: `product.md`, `tech.md` and `structure.md` use `inclusion: always`. They hold the hard mobile rules (24/44/12 px, landscape only, no keyboard or mouse prompts) and the module boundary that keeps the simulation DOM-free.
- **Agent hooks** (files present; `[TODO confirm they fired in Kiro]`):
  - `test-on-save`: runs Vitest when simulation code changes.
  - `mobile-ui-guard`: an agent prompt that re-audits UI rule compliance when HTML, CSS or `main.js` changes.
  - `build-on-stop`: runs the production build at the end of each agent turn.
- **Vibe coding vs. spec**:
  - The spec covers the game rules, where precision mattered.
  - The "costume" (fog, flicker, silhouettes, palette, synth audio) was built with fast visual iteration.
- **MCP**: not used for the public build. `scripts/screenshot.mjs` is the scripted Playwright equivalent for 914x411 audits. `[TODO only if you later connect a browser/Playwright MCP in Kiro]`
- **Powers**: none bundled. `[TODO only if used]`

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

**How Kiro helped.** `[TODO: rewrite from your real experience after opening the repo in Kiro IDE]` Ready draft once the re-run is done:
- The game rules live as a Kiro-shaped spec with EARS acceptance criteria in `.kiro/specs/ghost-tide/`. Those criteria map almost one-to-one onto Vitest tests; one of them covers the oil "dry latch" (the lantern must go dark the frame oil hits zero).
- Steering files are meant to keep the mobile constraints (24/44/12 px, landscape only) in front of the agent on every turn.
- Hooks are wired to run tests on save and the build on stop — confirm they actually fire inside Kiro before claiming this in the post.
- For the visual "costume", fast taste-driven iteration was the better tool than a rigid spec.

Play it on your phone, sideways, with the sound on: https://sengmu.github.io/Ghost-Tide/. Code (MIT): https://github.com/sengmu/Ghost-Tide.

## Social post draft
Ready to paste (update the Kiro claim after the IDE re-run if needed):

> #KiroweenHackathon26 🎃 Ghost Tide: five tides of the drowned, one lantern, not enough oil. A haunted horror mini-game for phones in landscape. Every pixel and sound is procedural. Spec, steering and hooks are in the repo for Kiroween. Play: https://sengmu.github.io/Ghost-Tide/ · Code (MIT): https://github.com/sengmu/Ghost-Tide

YouTube/Vimeo description paste (after you upload `ghost-tide-demo.mp4`):

> Ghost Tide — Kiroween 2026 Costume Contest
> Five tides of the drowned. One lantern. Not enough oil.
> Play (phone, landscape): https://sengmu.github.io/Ghost-Tide/
> Source (MIT): https://github.com/sengmu/Ghost-Tide
> Silent gameplay capture (~1:53). Left thumb walks, right thumb sweeps the lantern, flares clear swarms. Tide V ends on Dawn.
> `[TODO add voice-over / Kiro IDE B-roll per the 3-minute script above, then replace this line]`
