import { describe, expect, it } from 'vitest';
import { estimateCloudHeight } from '../src/index.js';

const items = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    label: `tag${i}`,
    weight: ((i * 37) % 100) + 1,
  }));

describe('estimateCloudHeight (#5)', () => {
  it('returns 0 for empty input or degenerate width', () => {
    expect(estimateCloudHeight([], 600)).toBe(0);
    expect(estimateCloudHeight(items(10), 0)).toBe(0);
  });

  it('returns a finite positive height that grows with item count', () => {
    const small = estimateCloudHeight(items(8), 600);
    const large = estimateCloudHeight(items(80), 600);
    expect(small).toBeGreaterThan(0);
    expect(Number.isFinite(small)).toBe(true);
    expect(large).toBeGreaterThan(small);
  });

  it('shrinks as the container gets wider (same area, more columns)', () => {
    const narrow = estimateCloudHeight(items(24), 400);
    const wideBox = estimateCloudHeight(items(24), 1200);
    expect(wideBox).toBeLessThan(narrow);
  });

  it('is never shorter than its tallest tag', () => {
    const one = estimateCloudHeight([{ label: 'Big', weight: 100 }], 600, {
      maxPx: 80,
    });
    // 80px font * 1.25 width factor cap... at minimum the tag's own line box
    expect(one).toBeGreaterThanOrEqual(50);
  });

  it('is pure and deterministic', () => {
    expect(estimateCloudHeight(items(24), 600)).toBe(
      estimateCloudHeight(items(24), 600),
    );
  });
});
