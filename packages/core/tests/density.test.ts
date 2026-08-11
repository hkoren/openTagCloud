import { describe, expect, it } from 'vitest';
import { clampDensity, clampFillFactor, padFor } from '../src/index.js';

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

describe('padFor (#51)', () => {
  it('tightens the gap as density rises, with 0.5 keeping the historical 5px', () => {
    expect(padFor(0.5)).toBeCloseTo(5, 5);
    expect(padFor(0)).toBeGreaterThan(padFor(0.5));
    expect(padFor(1)).toBeLessThan(padFor(0.5));
    // monotonic across the range and never collapsing to zero
    const pads = [0, 0.25, 0.5, 0.75, 1].map(padFor);
    for (let i = 1; i < pads.length; i++)
      expect(pads[i]).toBeLessThan(pads[i - 1]);
    expect(Math.min(...pads)).toBeGreaterThanOrEqual(1);
  });
});

describe('clampFillFactor (#58)', () => {
  it('defaults to 0.75 and clamps to [0, 1]', () => {
    expect(clampFillFactor(undefined)).toBe(0.75);
    expect(clampFillFactor(NaN)).toBe(0.75);
    expect(clampFillFactor(Infinity)).toBe(0.75);
    expect(clampFillFactor('1' as unknown as number)).toBe(0.75);
    expect(clampFillFactor(-2)).toBe(0);
    expect(clampFillFactor(7)).toBe(1);
    expect(clampFillFactor(0)).toBe(0);
    expect(clampFillFactor(1)).toBe(1);
    expect(clampFillFactor(0.4)).toBe(0.4);
  });
});
