import '@fontsource/creepster/400.css';
import '@fontsource/im-fell-english-sc/400.css';
import './style.css';
import { Game, FLARE } from './game.js';
import { TIDES } from './tides.js';
import { Renderer } from './render.js';
import { Stick, onTap } from './input.js';
import { Sfx } from './audio.js';

const $ = (id) => document.getElementById(id);
const show = (el, on = true) => el.classList.toggle('hidden', !on);

const sfx = new Sfx();
const renderer = new Renderer($('world'));
const move = new Stick($('moveStick'));
const aim = new Stick($('aimStick'), { deadzone: 0.25 });

let bannerTimer = 0;
const game = new Game(innerWidth, innerHeight, {
  banner(title, sub, dur = 2.4) {
    const b = $('banner');
    b.innerHTML = (title ? `<div class="banner-title flicker">${title}</div>` : '') + `<div class="banner-sub">${sub}</div>`;
    show(b, true); b.classList.remove('fade'); void b.offsetWidth; b.classList.add('fade');
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => show(b, false), dur * 1000);
  },
  sfx(name) { sfx[name]?.(); },
  hurt() {
    document.body.classList.remove('hurt'); void document.body.offsetWidth; document.body.classList.add('hurt');
    navigator.vibrate?.(120);
  },
  end(won, souls, tide) {
    show($('hud'), false); show($('controls'), false);
    $('endTitle').textContent = won ? 'Dawn' : 'The light went out';
    $('endText').textContent = won
      ? `You kept the flame through all five tides and banished ${souls} souls. The sea is quiet - for now.`
      : `The drowned took you on Tide ${TIDES[Math.min(tide, TIDES.length - 1)].name}. ${souls} souls were banished before the dark closed in.`;
    $('endScreen').classList.toggle('won', won);
    setTimeout(() => show($('endScreen'), true), 700);
  },
});

function resize() {
  const w = innerWidth, h = innerHeight, dpr = Math.min(devicePixelRatio || 1, 3);
  game.resize(w, h);
  renderer.resize(w, h, dpr, game);
}
addEventListener('resize', resize);
resize();

function begin() {
  sfx.unlock();
  [$('titleScreen'), $('endScreen'), $('pauseScreen')].forEach((s) => show(s, false));
  show($('hud')); show($('controls'));
  document.documentElement.requestFullscreen?.().catch(() => {});
  screen.orientation?.lock?.('landscape').catch(() => {});
  game.start();
}

function pause(on) {
  if (on && !['intro', 'fight', 'ebb'].includes(game.phase)) return;
  if (on) { game.resumePhase = game.phase; game.phase = 'paused'; move.reset(); aim.reset(); }
  else if (game.phase === 'paused') game.phase = game.resumePhase;
  show($('pauseScreen'), on);
}

onTap($('startBtn'), begin);
onTap($('retryBtn'), begin);
onTap($('pauseBtn'), () => pause(true));
onTap($('resumeBtn'), () => pause(false));
onTap($('quitBtn'), () => {
  show($('pauseScreen'), false); show($('hud'), false); show($('controls'), false);
  game.phase = 'title'; show($('titleScreen'));
});
onTap($('flareBtn'), () => { if (game.useFlare()) navigator.vibrate?.(40); });
onTap($('muteBtn'), () => {
  sfx.setMuted(!sfx.muted);
  $('muteBtn').textContent = `Sound: ${sfx.muted ? 'off' : 'on'}`;
});
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(true); });
document.addEventListener('contextmenu', (e) => e.preventDefault());

let hudCache = '';
function updateHud() {
  if (!game.keeper) return;
  const tide = TIDES[Math.min(game.tideIndex, TIDES.length - 1)];
  const key = [tide.name, game.keeper.hp, Math.round(game.oil * 50), game.souls, game.flares, game.dry].join('|');
  if (key === hudCache) return;
  hudCache = key;
  $('tideLabel').textContent = `Tide ${tide.name} / V`;
  $('hearts').innerHTML = Array.from({ length: 3 }, (_, i) =>
    `<svg class="heart ${i < game.keeper.hp ? '' : 'lost'}" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.3C1 7.9 3.5 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.5 0 6 3.4 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg>`).join('');
  $('oilFill').style.width = `${game.oil * 100}%`;
  $('oilFill').classList.toggle('dry', game.dry);
  $('souls').textContent = `Souls banished: ${game.souls}`;
  $('flareCount').textContent = game.flares;
  $('flareBtn').classList.toggle('empty', game.flares <= 0);
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  game.update(dt, { move, aim });
  renderer.draw(game, now / 1000);
  updateHud();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Read-only handle for automated smoke tests (Playwright). Not used by the game itself.
window.__ghostTide = { game, FLARE };
