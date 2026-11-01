// Headless smoke test: renders the built game at Solana Seeker-like landscape size (914x411),
// fails on any console error, and saves screenshots into docs/.
// Usage: npm run build && npx vite preview --port 4173 &  then  node scripts/screenshot.mjs
// Needs `playwright-core` (or `playwright`) resolvable and CHROME_PATH pointing at a Chrome/Chromium binary.
import { chromium } from 'playwright-core';

const url = process.env.URL || 'http://localhost:4173/';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 914, height: 411 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
page.on('requestfailed', (r) => errors.push('request failed: ' + r.url()));

await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
await page.screenshot({ path: 'docs/screenshot-title.png' });

await page.locator('#startBtn').dispatchEvent('pointerdown', { pointerId: 1, isPrimary: true });
await page.waitForTimeout(4200); // tide intro + first spawns

// hold the lantern stick and sweep up-left, where ghosts gather
const box = await page.locator('#aimStick').boundingBox();
const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
await page.mouse.move(cx, cy); await page.mouse.down();
for (let i = 0; i <= 20; i++) {
  const a = -Math.PI * 0.15 - (i / 20) * Math.PI * 0.7;
  await page.mouse.move(cx + Math.cos(a) * 50, cy + Math.sin(a) * 50);
  await page.waitForTimeout(90);
}
await page.screenshot({ path: 'docs/screenshot.png' });
const state = await page.evaluate(() => { const g = window.__ghostTide.game; return { phase: g.phase, tide: g.tideIndex + 1, ghosts: g.ghosts.length, souls: g.souls, oil: +g.oil.toFixed(2), beamOn: g.beam.on }; });
await page.mouse.up();

// layout audit: touch targets >= 44px, fonts >= 12px, controls inside a 24px safe margin
const audit = await page.evaluate(() => {
  const out = [];
  const W = innerWidth, H = innerHeight;
  for (const el of document.querySelectorAll('button, .stick')) {
    const r = el.getBoundingClientRect(); if (!r.width) continue;
    if (r.width < 44 || r.height < 44) out.push(`small target ${el.id || el.className} ${r.width}x${r.height}`);
    if (r.left < 24 || r.top < 24 || W - r.right < 24 || H - r.bottom < 24) out.push(`outside safe margin ${el.id || el.className}`);
  }
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el); if (cs.display === 'none' || !el.childNodes.length) continue;
    if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(cs.fontSize) < 12) out.push(`small font ${el.className} ${cs.fontSize}`);
  }
  return out;
});
console.log(JSON.stringify({ state, audit, errors }, null, 2));
await browser.close();
process.exit(errors.length ? 1 : 0);
