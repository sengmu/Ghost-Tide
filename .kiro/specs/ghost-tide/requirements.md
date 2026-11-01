# Requirements Document

## Introduction
Ghost Tide is a landscape-only mobile horror mini-game. The player, a lighthouse keeper, survives five tides of ghosts on a cursed island by aiming a lantern beam that banishes ghosts but burns limited oil.

## Requirements

### Requirement 1 - Landscape mobile shell
**User Story:** As a phone player, I want the game to fill my landscape screen with touch controls, so that I can play without a keyboard or mouse.

#### Acceptance Criteria
1. WHEN the game loads in landscape THE SYSTEM SHALL render the world canvas at the device pixel ratio filling the viewport.
2. WHEN the device is in portrait orientation THE SYSTEM SHALL show a "turn your phone sideways" screen and hide gameplay.
3. THE SYSTEM SHALL keep every interactive control at least 24 px from each screen edge and respect safe-area insets.
4. THE SYSTEM SHALL make every touch target at least 44 x 44 px.
5. THE SYSTEM SHALL render all text at 12 px or larger.
6. THE SYSTEM SHALL NOT display keyboard or mouse instructions.

### Requirement 2 - Movement
**User Story:** As the keeper, I want to walk around the island with my left thumb, so that I can dodge ghosts.

#### Acceptance Criteria
1. WHILE the walk stick is held beyond its dead-zone THE SYSTEM SHALL move the keeper in the stick direction at up to 120 px/s.
2. THE SYSTEM SHALL keep the keeper inside the island outline and outside the lighthouse tower.
3. WHEN the walk stick is released THE SYSTEM SHALL stop the keeper.

### Requirement 3 - Lantern beam and oil
**User Story:** As the keeper, I want to sweep a lantern with my right thumb, so that I can reveal and banish ghosts.

#### Acceptance Criteria
1. WHILE the lantern stick is held AND oil is not depleted THE SYSTEM SHALL emit a cone of light toward the stick direction.
2. WHILE a ghost overlaps the cone THE SYSTEM SHALL reduce its health, slow it to 30 % speed and reveal its body.
3. WHILE the beam is on THE SYSTEM SHALL drain oil; WHILE it is off THE SYSTEM SHALL regenerate oil.
4. WHEN oil reaches zero THE SYSTEM SHALL switch the beam off and keep it off until oil recovers to 25 %.
5. THE SYSTEM SHALL keep ghost eyes visible in darkness.

### Requirement 4 - Ghosts and tides
**User Story:** As a player, I want five escalating tides, so that the night builds to a climax.

#### Acceptance Criteria
1. THE SYSTEM SHALL run exactly five tides in order I-V.
2. WHEN a tide begins THE SYSTEM SHALL announce its name and omen in a banner.
3. THE SYSTEM SHALL spawn ghosts from outside the screen edges that move toward the keeper.
4. THE SYSTEM SHALL provide wisp, shade, banshee (zig-zag) and wraith (boss) ghost types.
5. WHEN tide V is active THE SYSTEM SHALL spawn the wraith boss, which summons wisps and shows a health ring.
6. WHEN all ghosts of a tide are banished THE SYSTEM SHALL show an ebb banner and start the next tide.

### Requirement 5 - Damage, flare, win and loss
**User Story:** As a player, I want clear stakes and an emergency tool, so that every touch from a ghost matters.

#### Acceptance Criteria
1. WHEN a ghost touches the keeper AND the keeper is not invulnerable THE SYSTEM SHALL remove one of three hearts, grant 1.3 s invulnerability, shake the screen and pulse a red vignette.
2. WHEN the Flare button is tapped AND flares remain THE SYSTEM SHALL damage every ghost within 160 px.
3. THE SYSTEM SHALL grant two flares at the start of each tide.
4. WHEN hearts reach zero THE SYSTEM SHALL show a loss screen with a retry button.
5. WHEN tide V is cleared THE SYSTEM SHALL show a dawn victory screen.

### Requirement 6 - Atmosphere and polish
**User Story:** As a player, I want the UI itself to feel haunted, so that the game is memorable.

#### Acceptance Criteria
1. THE SYSTEM SHALL display drifting fog layers, a vignette and a flickering title.
2. THE SYSTEM SHALL play only runtime-synthesised audio, starting after the first tap, with a mute toggle.
3. WHEN the page is hidden THE SYSTEM SHALL pause the game.
4. WHERE the user prefers reduced motion THE SYSTEM SHALL disable fog drift and flicker animations.
5. THE SYSTEM SHALL use only open-licensed fonts and procedural art.
