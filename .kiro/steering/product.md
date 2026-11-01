---
inclusion: always
---
# Product: Ghost Tide

Ghost Tide is a short (5-8 minute) Halloween horror mini-game for **phones held in landscape**.
A lighthouse keeper on a cursed island must survive five "tides" of ghosts by sweeping a lantern beam.

## Audience & platform
- Mobile only. Reference device: Solana Seeker-class phone, landscape viewport **914 x 411 CSS px**, DPR ~2.6.
- Never show keyboard, mouse or desktop prompts. All input is touch: a left walk stick, a right lantern stick, a Flare button, a Pause button.

## Experience pillars
1. **Dread through darkness** - the world is almost black; ghosts are only fully visible inside light. Their eyes are always visible.
2. **One verb, mastered** - aim the lantern. Oil is limited, so the player must choose when to burn it.
3. **Costume-grade polish** - the UI is part of the horror: flickering Creepster titles, drifting fog, vignette pulses when hurt.

## Hard UI rules (must never regress)
- Safe margin >= 24 px from every edge (also respect `env(safe-area-inset-*)`).
- Touch targets >= 44 x 44 px.
- Text >= 12 px.
- Portrait shows a "turn your phone" screen instead of the game.

## Out of scope
Accounts, online features, ads, in-app purchases, wallets, third-party trademarks, copyrighted audio.
