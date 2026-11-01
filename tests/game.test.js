import { describe, it, expect } from 'vitest';
import { Game, BEAM } from '../src/game.js';
import { TIDES, buildQueue, totalGhosts } from '../src/tides.js';

const idle = { move: { active: false, x: 0, y: 0 }, aim: { active: false, angle: 0 } };

describe('tides', () => {
  it('has exactly five tides and the last one has the boss', () => {
    expect(TIDES).toHaveLength(5);
    expect(buildQueue(TIDES[4])).toContain('wraith');
    expect(buildQueue(TIDES[2])).toHaveLength(totalGhosts(TIDES[2]));
  });
});

describe('game', () => {
  it('starts on tide I with full life and oil', () => {
    const g = new Game(914, 411); g.start();
    expect(g.tideIndex).toBe(0); expect(g.keeper.hp).toBe(3); expect(g.oil).toBe(1); expect(g.phase).toBe('intro');
  });
  it('the beam drains oil and banishes a lit ghost', () => {
    const g = new Game(914, 411); g.start(); g.phase = 'fight'; g.queue = [];
    const ghost = g.spawn('wisp'); ghost.x = g.keeper.x + 120; ghost.y = g.keeper.y; ghost.speed = 0;
    const aim = { move: idle.move, aim: { active: true, angle: 0 } };
    g.beam.angle = 0;
    for (let i = 0; i < 30; i++) g.update(1 / 30, aim);
    expect(g.oil).toBeLessThan(1);
    expect(g.ghosts).toHaveLength(0);
    expect(g.souls).toBeGreaterThan(0);
  });
  it('lantern goes dry and must recover before relighting', () => {
    const g = new Game(914, 411); g.start(); g.phase = 'fight'; g.queue = []; g.remaining = 99;
    g.oil = 0.01;
    g.update(0.2, { move: idle.move, aim: { active: true, angle: 0 } });
    expect(g.dry).toBe(true); expect(g.beam.on).toBe(false);
    for (let i = 0; i < 20; i++) g.update(0.1, idle);
    expect(g.oil).toBeGreaterThanOrEqual(BEAM.relight);
  });
  it('touching a ghost costs a heart and three touches end the night', () => {
    let ended = null;
    const g = new Game(914, 411, { end: (won) => (ended = won) }); g.start(); g.phase = 'fight'; g.queue = []; g.remaining = 99;
    for (let i = 0; i < 3; i++) {
      const gh = g.spawn('shade'); gh.x = g.keeper.x; gh.y = g.keeper.y; g.keeper.inv = 0;
      g.update(0.016, idle);
    }
    expect(g.keeper.hp).toBe(0); expect(ended).toBe(false);
  });
  it('a flare hits every ghost in range and is limited per tide', () => {
    const g = new Game(914, 411); g.start(); g.phase = 'fight';
    const gh = g.spawn('shade'); gh.x = g.keeper.x + 50; gh.y = g.keeper.y;
    expect(g.useFlare()).toBe(true); expect(gh.hp).toBeLessThan(0);
    expect(g.useFlare()).toBe(true); expect(g.useFlare()).toBe(false);
  });
});
