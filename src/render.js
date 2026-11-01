// Canvas2D renderer. Every pixel is procedural: no image assets.
import { rng } from './geometry.js';
import { BEAM, FLARE } from './game.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dark = document.createElement('canvas');
    this.dctx = this.dark.getContext('2d');
    this.ground = document.createElement('canvas');
    this.gctx = this.ground.getContext('2d');
  }

  resize(w, h, dpr, game) {
    this.w = w; this.h = h; this.dpr = dpr;
    for (const c of [this.canvas, this.dark, this.ground]) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    this.canvas.style.width = w + 'px'; this.canvas.style.height = h + 'px';
    this.paintGround(game);
  }

  paintGround(game) {
    const g = this.gctx, { cx, cy, rx, ry } = game.island, r = rng(1031);
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    g.clearRect(0, 0, this.w, this.h);
    // jagged island outline
    const pts = [];
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2, j = 0.9 + r() * 0.16;
      pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
    }
    const path = () => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
    // surf ring
    g.save(); g.translate(0, 4); path(); g.fillStyle = 'rgba(160,190,200,0.12)'; g.fill(); g.restore();
    path();
    const sand = g.createRadialGradient(cx, cy, 10, cx, cy, rx);
    sand.addColorStop(0, '#3b3a35'); sand.addColorStop(0.7, '#2c2b27'); sand.addColorStop(1, '#1c1d1c');
    g.fillStyle = sand; g.fill();
    g.save(); path(); g.clip();
    // speckle
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(${200 + r() * 40},${190 + r() * 40},${160},${r() * 0.06})`;
      g.fillRect(cx - rx + r() * rx * 2, cy - ry + r() * ry * 2, 1.5, 1.5);
    }
    // dead grass tufts
    g.strokeStyle = 'rgba(90,100,70,0.5)'; g.lineWidth = 1;
    for (let i = 0; i < 70; i++) {
      const x = cx - rx + r() * rx * 2, y = cy - ry + r() * ry * 2;
      for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 8, y - 4 - r() * 6); g.stroke(); }
    }
    g.restore();
    // rocks on the rim
    for (let i = 0; i < 14; i++) {
      const a = r() * Math.PI * 2, x = cx + Math.cos(a) * rx * 0.95, y = cy + Math.sin(a) * ry * 0.95, s = 6 + r() * 10;
      g.fillStyle = '#15171a'; g.beginPath(); g.ellipse(x, y, s, s * 0.7, r() * 3, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.05)'; g.beginPath(); g.ellipse(x - s * 0.2, y - s * 0.2, s * 0.5, s * 0.3, 0, 0, Math.PI * 2); g.fill();
    }
    // graves of the keepers who came before
    for (let i = 0; i < 9; i++) {
      const a = r() * Math.PI * 2, d = 0.45 + r() * 0.35;
      const x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d;
      if (Math.hypot(x - game.tower.x, y - game.tower.y) < 60) continue;
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.ellipse(x + 2, y + 6, 9, 4, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#4a4c50';
      g.beginPath(); g.moveTo(x - 6, y + 6); g.lineTo(x - 6, y - 4); g.arc(x, y - 4, 6, Math.PI, 0); g.lineTo(x + 6, y + 6); g.closePath(); g.fill();
      g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(x - 0.75, y - 6, 1.5, 7); g.fillRect(x - 3, y - 3.5, 6, 1.5);
    }
  }

  draw(game, t) {
    const c = this.ctx, { w, h } = this;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const sx = (Math.random() - 0.5) * game.shake, sy = (Math.random() - 0.5) * game.shake;
    c.save(); c.translate(sx, sy);
    this.drawSea(c, t);
    c.drawImage(this.ground, 0, 0, w, h);
    this.drawTower(c, game, t);
    if (game.keeper) this.drawKeeper(c, game, t);
    if (game.ghosts) for (const g of game.ghosts) this.drawGhost(c, g, t);
    this.drawDarkness(c, game, t);
    if (game.ghosts) for (const g of game.ghosts) this.drawEyes(c, g, t);
    this.drawFx(c, game);
    c.restore();
  }

  drawSea(c, t) {
    const { w, h } = this;
    const sea = c.createLinearGradient(0, 0, 0, h);
    sea.addColorStop(0, '#04121a'); sea.addColorStop(1, '#020a10');
    c.fillStyle = sea; c.fillRect(-20, -20, w + 40, h + 40);
    c.strokeStyle = 'rgba(120,180,190,0.07)'; c.lineWidth = 1;
    for (let y = 8; y < h; y += 14) {
      c.beginPath();
      for (let x = -10; x <= w + 10; x += 12) {
        const yy = y + Math.sin(x * 0.03 + t * 0.8 + y) * 3;
        x === -10 ? c.moveTo(x, yy) : c.lineTo(x, yy);
      }
      c.stroke();
    }
  }

  drawTower(c, game, t) {
    const { x, y, r } = game.tower;
    c.fillStyle = 'rgba(0,0,0,0.45)'; c.beginPath(); c.ellipse(x + 6, y + 8, r + 4, r * 0.8, 0, 0, Math.PI * 2); c.fill();
    const body = c.createRadialGradient(x - 6, y - 6, 2, x, y, r);
    body.addColorStop(0, '#e9e1c6'); body.addColorStop(1, '#6d6754');
    c.fillStyle = body; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    // red stripes ring
    c.strokeStyle = '#7a1f1f'; c.lineWidth = 4; c.beginPath(); c.arc(x, y, r - 5, 0, Math.PI * 2); c.stroke();
    c.fillStyle = '#1a1712'; c.beginPath(); c.arc(x, y, 9, 0, Math.PI * 2); c.fill();
    const flick = 0.75 + Math.sin(t * 13) * 0.08 + Math.sin(t * 31) * 0.05;
    c.fillStyle = `rgba(255,210,120,${flick})`; c.beginPath(); c.arc(x, y, 6, 0, Math.PI * 2); c.fill();
  }

  drawKeeper(c, game, t) {
    const k = game.keeper;
    if (k.inv > 0 && Math.floor(t * 16) % 2) return;
    c.fillStyle = 'rgba(0,0,0,0.5)'; c.beginPath(); c.ellipse(k.x + 2, k.y + 6, 10, 4, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#2b3442'; c.beginPath(); c.arc(k.x, k.y, 10, 0, Math.PI * 2); c.fill();     // oilskin coat
    c.fillStyle = '#c9b27a'; c.beginPath(); c.arc(k.x, k.y - 1, 6.5, 0, Math.PI * 2); c.fill(); // sou'wester hat
    c.strokeStyle = '#8a7444'; c.lineWidth = 1.5; c.beginPath(); c.arc(k.x, k.y - 1, 6.5, 0, Math.PI * 2); c.stroke();
    // lantern in hand
    const a = game.beam.angle, lx = k.x + Math.cos(a) * 12, ly = k.y + Math.sin(a) * 12;
    c.fillStyle = game.beam.on ? '#ffd47a' : '#5b4a2a'; c.beginPath(); c.arc(lx, ly, 3.5, 0, Math.PI * 2); c.fill();
  }

  ghostPath(c, g, t) {
    const r = g.r, wob = Math.sin(t * 3 + g.seed) * 2;
    c.beginPath();
    c.arc(g.x, g.y - r * 0.2 + wob, r, Math.PI, 0);
    const base = g.y + r * 1.1 + wob;
    c.lineTo(g.x + r, base);
    const n = 4;
    for (let i = n; i >= 0; i--) {
      const xx = g.x - r + (2 * r * i) / n;
      c.lineTo(xx, base + (i % 2 ? 0 : 5) * Math.sin(t * 6 + i + g.seed));
    }
    c.closePath();
  }

  drawGhost(c, g, t) {
    const a = 0.12 + g.lit * 0.78;
    const grad = c.createRadialGradient(g.x, g.y - g.r * 0.4, 1, g.x, g.y, g.r * 1.6);
    grad.addColorStop(0, `hsla(${g.hue},70%,92%,${a})`);
    grad.addColorStop(1, `hsla(${g.hue},60%,45%,${a * 0.2})`);
    c.fillStyle = grad;
    this.ghostPath(c, g, t); c.fill();
    if (g.boss) {
      c.strokeStyle = `rgba(255,80,80,0.8)`; c.lineWidth = 3;
      c.beginPath(); c.arc(g.x, g.y, g.r + 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, g.hp / g.max)); c.stroke();
    }
  }

  drawEyes(c, g, t) {
    const blink = Math.sin(t * 1.3 + g.seed * 7) > 0.97 ? 0.15 : 1;
    const e = g.r * 0.32, y = g.y - g.r * 0.25 + Math.sin(t * 3 + g.seed) * 2;
    const col = g.type === 'banshee' || g.boss ? '255,60,70' : '160,255,240';
    c.save(); c.globalCompositeOperation = 'lighter';
    c.fillStyle = `rgba(${col},${0.85 * blink})`; c.shadowColor = `rgb(${col})`; c.shadowBlur = 8;
    c.beginPath(); c.ellipse(g.x - e, y, e * 0.45, e * 0.6 * blink, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(g.x + e, y, e * 0.45, e * 0.6 * blink, 0, 0, Math.PI * 2); c.fill();
    c.restore();
  }

  drawDarkness(c, game, t) {
    const d = this.dctx, { w, h } = this;
    d.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    d.globalCompositeOperation = 'source-over';
    d.clearRect(0, 0, w, h);
    d.fillStyle = 'rgba(1,3,7,0.84)'; d.fillRect(0, 0, w, h);
    d.globalCompositeOperation = 'destination-out';
    const hole = (x, y, r, s = 1) => {
      const g = d.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${s})`); g.addColorStop(1, 'rgba(0,0,0,0)');
      d.fillStyle = g; d.beginPath(); d.arc(x, y, r, 0, Math.PI * 2); d.fill();
    };
    const tw = game.tower;
    hole(tw.x, tw.y, 70, 0.75);
    // the great lighthouse lens sweeps slowly - pretty, but too weak to banish anything
    this.cone(d, tw.x, tw.y, t * 0.35, 0.09, Math.max(w, h), 0.35);
    if (game.keeper) {
      const k = game.keeper;
      hole(k.x, k.y, 55, 0.85);
      if (game.beam.on) {
        const fl = 0.92 + Math.sin(t * 40) * 0.04 + (game.oil < 0.2 ? Math.sin(t * 90) * 0.25 : 0);
        this.cone(d, k.x, k.y, game.beam.angle, BEAM.half, BEAM.len, fl);
      }
    }
    for (const f of game.flashes || []) hole(f.x, f.y, FLARE.radius * (0.6 + f.t), 1 - f.t / 0.8);
    c.drawImage(this.dark, 0, 0, w, h);

    // warm tint inside the beam
    if (game.keeper && game.beam.on) {
      c.save(); c.globalCompositeOperation = 'lighter';
      this.cone(c, game.keeper.x, game.keeper.y, game.beam.angle, BEAM.half, BEAM.len, 0.16, '255,190,90');
      c.restore();
    }
  }

  cone(ctx, x, y, angle, half, len, strength, rgb = '0,0,0') {
    const g = ctx.createRadialGradient(x, y, 4, x, y, len);
    g.addColorStop(0, `rgba(${rgb},${strength})`);
    g.addColorStop(0.75, `rgba(${rgb},${strength * 0.7})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, len, angle - half, angle + half); ctx.closePath(); ctx.fill();
  }

  drawFx(c, game) {
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const p of game.particles || []) {
      const a = 1 - p.t / p.life;
      c.fillStyle = `hsla(${p.hue},80%,75%,${a * 0.8})`;
      c.beginPath(); c.arc(p.x, p.y, 1.5 + a * 2, 0, Math.PI * 2); c.fill();
    }
    for (const f of game.flashes || []) {
      c.strokeStyle = `rgba(255,220,150,${1 - f.t / 0.8})`; c.lineWidth = 3;
      c.beginPath(); c.arc(f.x, f.y, FLARE.radius * (0.3 + f.t), 0, Math.PI * 2); c.stroke();
    }
    c.restore();
  }
}
