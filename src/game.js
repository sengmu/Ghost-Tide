// Game simulation. Pure state + update; no DOM access so it can be unit-tested.
import { GHOST_TYPES, TIDES, buildQueue, totalGhosts } from './tides.js';
import { inCone, clampToEllipse, wrapAngle } from './geometry.js';

export const BEAM = { len: 250, half: 0.34, dps: 1.6, drain: 0.13, regen: 0.22, relight: 0.25 };
export const KEEPER = { speed: 120, r: 11, hp: 3, invuln: 1.3 };
export const FLARE = { radius: 160, damage: 6, perTide: 2 };

export class Game {
  constructor(w, h, hooks = {}) {
    this.hooks = hooks;
    this.resize(w, h);
    this.phase = 'title';
    this.time = 0;
  }

  resize(w, h) {
    this.w = w; this.h = h;
    this.island = { cx: w / 2, cy: h / 2 + 6, rx: w * 0.36, ry: h * 0.33 };
    this.tower = { x: w / 2, y: h / 2 - 4, r: 20 };
  }

  start() {
    this.keeper = { x: this.tower.x, y: this.tower.y + 48, hp: KEEPER.hp, inv: 0, face: -Math.PI / 2 };
    this.ghosts = [];
    this.particles = [];
    this.flashes = [];
    this.oil = 1; this.dry = false;
    this.beam = { on: false, angle: -Math.PI / 2 };
    this.souls = 0;
    this.shake = 0;
    this.tideIndex = -1;
    this.nextTide();
  }

  nextTide() {
    this.tideIndex++;
    if (this.tideIndex >= TIDES.length) return this.end(true);
    const tide = TIDES[this.tideIndex];
    this.queue = buildQueue(tide);
    this.remaining = totalGhosts(tide);
    this.spawnTimer = 1.5;
    this.flares = FLARE.perTide;
    this.phase = 'intro';
    this.phaseTimer = 2.6;
    this.hooks.banner?.(`Tide ${tide.name}`, tide.omen);
    this.hooks.sfx?.('wail');
  }

  end(won) {
    this.phase = won ? 'won' : 'over';
    this.beam.on = false;
    this.hooks.end?.(won, this.souls, this.tideIndex);
  }

  spawn(type) {
    const t = GHOST_TYPES[type];
    const side = Math.floor(Math.random() * 4);
    const m = 40;
    let x, y;
    if (side === 0) { x = Math.random() * this.w; y = -m; }
    else if (side === 1) { x = this.w + m; y = Math.random() * this.h; }
    else if (side === 2) { x = Math.random() * this.w; y = this.h + m; }
    else { x = -m; y = Math.random() * this.h; }
    const g = { type, x, y, hp: t.hp, max: t.hp, r: t.r, speed: t.speed, hue: t.hue, lit: 0, age: 0,
      seed: Math.random() * 100, zig: !!t.zigzag, boss: !!t.boss, summon: 3 };
    this.ghosts.push(g);
    return g;
  }

  useFlare() {
    if (this.phase !== 'fight' || this.flares <= 0) return false;
    this.flares--;
    const k = this.keeper;
    this.flashes.push({ x: k.x, y: k.y, t: 0 });
    for (const g of this.ghosts) {
      if (Math.hypot(g.x - k.x, g.y - k.y) < FLARE.radius + g.r) g.hp -= FLARE.damage;
    }
    this.shake = Math.max(this.shake, 6);
    this.hooks.sfx?.('flare');
    return true;
  }

  update(dt, input) {
    this.time += dt;
    if (this.phase === 'title' || this.phase === 'over' || this.phase === 'won' || this.phase === 'paused') return;

    this.updateKeeper(dt, input);
    this.updateBeam(dt, input);

    if (this.phase === 'intro') {
      this.phaseTimer -= dt;
      if (this.phaseTimer <= 0) this.phase = 'fight';
    } else if (this.phase === 'fight') {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0 && this.queue.length) {
        this.spawn(this.queue.shift());
        this.spawnTimer = TIDES[this.tideIndex].interval * (0.7 + Math.random() * 0.6);
      }
      if (!this.queue.length && this.remaining <= 0 && this.ghosts.length === 0) {
        this.phase = 'ebb';
        this.phaseTimer = 2.2;
        this.hooks.banner?.('The tide ebbs', this.tideIndex === TIDES.length - 1 ? 'Dawn breaks over the reef' : 'Trim the wick. They are coming back.');
      }
    } else if (this.phase === 'ebb') {
      this.phaseTimer -= dt;
      if (this.phaseTimer <= 0) this.nextTide();
    }

    this.updateGhosts(dt);
    this.updateFx(dt);
  }

  updateKeeper(dt, input) {
    const k = this.keeper;
    if (input.move.active) {
      k.x += input.move.x * KEEPER.speed * dt;
      k.y += input.move.y * KEEPER.speed * dt;
      k.face = Math.atan2(input.move.y, input.move.x);
    }
    const i = this.island;
    [k.x, k.y] = clampToEllipse(k.x, k.y, i.cx, i.cy, i.rx - 14, i.ry - 12);
    // cannot walk through the lighthouse
    const t = this.tower, d = Math.hypot(k.x - t.x, k.y - t.y), min = t.r + KEEPER.r;
    if (d < min) {
      const a = d === 0 ? Math.PI / 2 : Math.atan2(k.y - t.y, k.x - t.x);
      k.x = t.x + Math.cos(a) * min; k.y = t.y + Math.sin(a) * min;
    }
    if (k.inv > 0) k.inv -= dt;
  }

  updateBeam(dt, input) {
    const wants = input.aim.active;
    if (wants) {
      // ease the beam toward the thumb so it feels heavy, like a real lantern
      const target = input.aim.angle;
      this.beam.angle += wrapAngle(target - this.beam.angle) * Math.min(1, dt * 14);
    }
    if (this.dry && this.oil >= BEAM.relight) this.dry = false;
    this.beam.on = wants && !this.dry;
    if (this.beam.on) {
      this.oil -= BEAM.drain * dt;
      if (this.oil <= 0) { this.oil = 0; this.dry = true; this.beam.on = false; this.hooks.banner?.('', 'The lantern sputters...', 1.2); }
    } else {
      this.oil = Math.min(1, this.oil + BEAM.regen * dt);
    }
  }

  updateGhosts(dt) {
    const k = this.keeper;
    for (const g of this.ghosts) {
      g.age += dt;
      const lit = this.beam.on && inCone(g.x, g.y, k.x, k.y, this.beam.angle, BEAM.half, BEAM.len, g.r);
      g.lit = lit ? Math.min(1, g.lit + dt * 6) : Math.max(0, g.lit - dt * 2.5);
      if (lit) g.hp -= BEAM.dps * dt;

      const dx = k.x - g.x, dy = k.y - g.y, d = Math.hypot(dx, dy) || 1;
      let sp = g.speed * (lit ? 0.3 : 1) * (g.age < 1 ? 0.6 : 1);
      let vx = dx / d, vy = dy / d;
      if (g.zig) { const s = Math.sin(g.age * 4 + g.seed) * 0.9; vx += -dy / d * s; vy += dx / d * s; }
      g.x += vx * sp * dt; g.y += vy * sp * dt;

      if (g.boss && this.phase === 'fight') {
        g.summon -= dt;
        if (g.summon <= 0) {
          g.summon = 3.2;
          const w = this.spawn('wisp'); w.x = g.x; w.y = g.y; this.remaining++;
        }
      }

      if (g.hp > 0 && d < g.r + KEEPER.r) {
        g.hp = 0; g.hurtKeeper = true;
        if (k.inv <= 0) {
          k.hp--; k.inv = KEEPER.invuln; this.shake = 10;
          this.hooks.sfx?.('hurt');
          this.hooks.hurt?.();
          if (k.hp <= 0) { this.end(false); }
        }
      }
    }
    const alive = [];
    for (const g of this.ghosts) {
      if (g.hp > 0) { alive.push(g); continue; }
      this.remaining--;
      if (!g.hurtKeeper) { this.souls += GHOST_TYPES[g.type].score; this.hooks.sfx?.('banish'); }
      this.burst(g);
    }
    this.ghosts = alive;
  }

  burst(g) {
    const n = g.boss ? 60 : 16;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = 20 + Math.random() * (g.boss ? 160 : 70);
      this.particles.push({ x: g.x, y: g.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 20, life: 0.6 + Math.random() * 0.7, t: 0, hue: g.hue });
    }
  }

  updateFx(dt) {
    for (const p of this.particles) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; }
    this.particles = this.particles.filter((p) => p.t < p.life);
    for (const f of this.flashes) f.t += dt;
    this.flashes = this.flashes.filter((f) => f.t < 0.8);
    this.shake = Math.max(0, this.shake - dt * 30);
  }
}
