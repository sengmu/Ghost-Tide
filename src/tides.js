// Five tides of the dead. Each entry lists how many of each ghost rises, and how quickly.
export const GHOST_TYPES = {
  wisp:    { speed: 58, hp: 0.55, r: 10, hue: 185, score: 1 },
  shade:   { speed: 30, hp: 2.2,  r: 17, hue: 260, score: 3 },
  banshee: { speed: 74, hp: 1.1,  r: 12, hue: 330, score: 2, zigzag: true },
  wraith:  { speed: 22, hp: 22,   r: 36, hue: 120, score: 25, boss: true },
};

export const TIDES = [
  { name: 'I',   omen: 'The drowned are restless',        spawn: { wisp: 8 },                          interval: 1.2 },
  { name: 'II',  omen: 'Shades crawl from the kelp',      spawn: { wisp: 10, shade: 3 },               interval: 1.0 },
  { name: 'III', omen: 'A banshee wails on the reef',     spawn: { wisp: 10, shade: 4, banshee: 4 },   interval: 0.85 },
  { name: 'IV',  omen: 'The fog thickens to a scream',    spawn: { wisp: 14, shade: 6, banshee: 7 },   interval: 0.7 },
  { name: 'V',   omen: 'The Drowned Keeper returns',      spawn: { wisp: 12, shade: 5, banshee: 5, wraith: 1 }, interval: 0.75 },
];

/** Expand a tide into a shuffled spawn queue. Boss always arrives last-ish (after 40%). */
export function buildQueue(tide, rand = Math.random) {
  const q = [];
  let boss = null;
  for (const [type, n] of Object.entries(tide.spawn)) {
    for (let i = 0; i < n; i++) {
      if (GHOST_TYPES[type].boss) boss = type; else q.push(type);
    }
  }
  for (let i = q.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [q[i], q[j]] = [q[j], q[i]];
  }
  if (boss) q.splice(Math.floor(q.length * 0.4), 0, boss);
  return q;
}

export function totalGhosts(tide) {
  return Object.values(tide.spawn).reduce((a, b) => a + b, 0);
}
