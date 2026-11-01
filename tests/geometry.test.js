import { describe, it, expect } from 'vitest';
import { inCone, wrapAngle, clampToEllipse } from '../src/geometry.js';

describe('geometry', () => {
  it('wraps angles into [-PI, PI)', () => {
    expect(wrapAngle(3 * Math.PI)).toBeCloseTo(-Math.PI);
    expect(wrapAngle(-0.5)).toBeCloseTo(-0.5);
  });
  it('detects points inside the lantern cone', () => {
    expect(inCone(100, 0, 0, 0, 0, 0.3, 200)).toBe(true);
    expect(inCone(0, 100, 0, 0, 0, 0.3, 200)).toBe(false);
    expect(inCone(300, 0, 0, 0, 0, 0.3, 200)).toBe(false);
  });
  it('handles the -PI/PI seam', () => {
    expect(inCone(-100, 1, 0, 0, Math.PI, 0.2, 200)).toBe(true);
    expect(inCone(-100, -1, 0, 0, -Math.PI, 0.2, 200)).toBe(true);
  });
  it('counts large ghosts that only overlap the cone edge', () => {
    expect(inCone(100, 40, 0, 0, 0, 0.3, 200, 20)).toBe(true);
  });
  it('clamps the keeper to the island', () => {
    const [x, y] = clampToEllipse(500, 0, 0, 0, 100, 50);
    expect(x).toBeCloseTo(100); expect(y).toBeCloseTo(0);
  });
});
