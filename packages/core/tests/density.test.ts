import { describe, expect, it } from 'vitest';
import { clampDensity } from '../src/index.js';

describe('clampDensity (#51)', () => {
  it('defaults to 0.5 and clamps to [0, 1]', () => {
    expect(clampDensity(undefined)).toBe(0.5);
    expect(clampDensity(NaN)).toBe(0.5);
    expect(clampDensity(Infinity)).toBe(0.5);
    expect(clampDensity(0)).toBe(0);
    expect(clampDensity(1)).toBe(1);
    expect(clampDensity(0.25)).toBe(0.25);
    expect(clampDensity(-3)).toBe(0);
    expect(clampDensity(7)).toBe(1);
  });
});
