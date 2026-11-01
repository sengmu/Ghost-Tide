// Pure math helpers (unit-tested in tests/geometry.test.js)
export const TAU = Math.PI * 2;

export function wrapAngle(a) {
  a = (a + Math.PI) % TAU;
  if (a < 0) a += TAU;
  return a - Math.PI;
}

/** Is point (px,py) inside a cone starting at (ox,oy), facing `angle`, with half-angle `half` and length `len`? */
export function inCone(px, py, ox, oy, angle, half, len, radius = 0) {
  const dx = px - ox, dy = py - oy;
  const d = Math.hypot(dx, dy);
  if (d > len + radius) return false;
  if (d <= radius) return true;
  const diff = Math.abs(wrapAngle(Math.atan2(dy, dx) - angle));
  // widen the cone slightly by the target's angular size
  return diff <= half + Math.asin(Math.min(1, radius / d));
}

/** Clamp a point to lie within an ellipse centred at (cx,cy) with radii rx, ry. */
export function clampToEllipse(x, y, cx, cy, rx, ry) {
  const nx = (x - cx) / rx, ny = (y - cy) / ry;
  const k = Math.hypot(nx, ny);
  if (k <= 1) return [x, y];
  return [cx + (nx / k) * rx, cy + (ny / k) * ry];
}

/** Deterministic PRNG (mulberry32) so the island looks the same every run. */
export function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
