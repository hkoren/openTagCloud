import { describe, expect, it, vi } from 'vitest';
import { keyOf, prepareTags } from '../src/index.js';

const item = (label: string, weight: number, extra = {}) => ({
  label,
  weight,
  ...extra,
});

describe('prepareTags', () => {
  it('gives heavier tags larger fonts and higher opacity (same label length)', () => {
    const [light, mid, heavy] = prepareTags([
      item('aaaa', 10),
      item('bbbb', 50),
      item('cccc', 100),
    ]);
    expect(light.fontPx).toBeLessThan(mid.fontPx);
    expect(mid.fontPx).toBeLessThan(heavy.fontPx);
    expect(light.opacity).toBeLessThan(mid.opacity);
    expect(mid.opacity).toBeLessThan(heavy.opacity);
  });

  it('never sizes below the 9px floor and keeps opacity in [0.62, 1]', () => {
    const many = Array.from({ length: 200 }, (_, i) =>
      item(`averylongtagname-number-${i}`, i + 1),
    );
    for (const p of prepareTags(many, { minPx: 6, maxPx: 12 })) {
      expect(p.fontPx).toBeGreaterThanOrEqual(9);
      expect(p.opacity).toBeGreaterThanOrEqual(0.62);
      expect(p.opacity).toBeLessThanOrEqual(1);
    }
  });

  it('respects minPx/maxPx as the ramp range before scaling factors', () => {
    // 18 tags → countFactor is exactly 1, short labels → lengthFactor 1,
    // so the ramp endpoints surface directly.
    const items = Array.from({ length: 18 }, (_, i) =>
      item(`t${i}`, i === 0 ? 100 : 1),
    );
    const prepared = prepareTags(items, { minPx: 14, maxPx: 56 });
    expect(prepared[0].fontPx).toBe(56);
    expect(Math.min(...prepared.map((p) => p.fontPx))).toBeGreaterThanOrEqual(
      14,
    );
  });

  it('clamps negative and non-finite weights to 0 instead of emitting NaN (#1)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const prepared = prepareTags([
      item('negative', -5),
      item('nan', NaN),
      item('infinite', Infinity),
      item('ok', 10),
    ]);
    for (const p of prepared) {
      expect(Number.isFinite(p.fontPx)).toBe(true);
      expect(Number.isFinite(p.opacity)).toBe(true);
      expect(Number.isFinite(p.weight)).toBe(true);
      expect(p.style).not.toContain('NaN');
    }
    expect(prepared[0].weight).toBe(0);
    expect(prepared[1].weight).toBe(0);
    expect(prepared[2].weight).toBe(0);
    expect(prepared[3].weight).toBe(10);
    // bad weights rank below every valid weight
    expect(prepared[0].fontPx).toBeLessThan(prepared[3].fontPx);
    // warns once total, not per bad weight
    prepareTags([item('again', -1)]);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('keys by id, falling back to label', () => {
    expect(keyOf({ label: 'a', weight: 1 })).toBe('a');
    expect(keyOf({ label: 'a', weight: 1, id: 'x' })).toBe('x');
    const [p] = prepareTags([item('a', 1, { id: 'x' })]);
    expect(p.key).toBe('x');
  });

  it('renders hyphens as non-breaking hyphens in the display text', () => {
    const [p] = prepareTags([item('tag-cloud', 1)]);
    expect(p.text).toBe('tag‑cloud');
    expect(p.item.label).toBe('tag-cloud'); // original untouched
  });

  it('joins the base class with item.class', () => {
    const [a, b] = prepareTags([
      item('a', 1),
      item('b', 1, { class: 'muted x' }),
    ]);
    expect(a.className).toBe('otc-tag');
    expect(b.className).toBe('otc-tag muted x');
  });

  it('emits the per-tag color custom property only when set', () => {
    const [plain, colored] = prepareTags([
      item('a', 1),
      item('b', 1, { color: 'tomato' }),
    ]);
    expect(plain.style).not.toContain('--otc-tag-color');
    expect(colored.style).toContain('--otc-tag-color:tomato;');
  });

  it('defaults the title to the raw weight, honoring an explicit title', () => {
    const [a, b] = prepareTags([item('a', 42), item('b', 1, { title: 'hi' })]);
    expect(a.title).toBe('42');
    expect(b.title).toBe('hi');
  });
});
