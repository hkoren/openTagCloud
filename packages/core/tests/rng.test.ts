import { describe, expect, it } from 'vitest';
import { makeRng } from '../src/index.js';

describe('makeRng', () => {
  it('is deterministic per seed and differs across seeds', () => {
    const a1 = makeRng('seed');
    const a2 = makeRng('seed');
    const b = makeRng('other');
    const seqA1 = [a1(), a1(), a1()];
    const seqA2 = [a2(), a2(), a2()];
    const seqB = [b(), b(), b()];
    expect(seqA1).toEqual(seqA2);
    expect(seqA1).not.toEqual(seqB);
  });

  it('stays in [0, 1)', () => {
    const r = makeRng('range');
    for (let i = 0; i < 1000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  // Golden values: any change to this sequence silently breaks SSR/hydration
  // position parity for existing content. Change these ONLY as a deliberate,
  // documented breaking change.
  it('matches the pinned golden sequence', () => {
    const golden: [string, number[]][] = [
      [
        'JavaScript',
        [
          0.7860133785288781, 0.08270447212271392, 0.6944194971583784,
          0.8249739848542958,
        ],
      ],
      [
        'Rust',
        [
          0.3869112520478666, 0.41901409486308694, 0.4189034022856504,
          0.9362301691435277,
        ],
      ],
      [
        '',
        [
          0.4067474587354809, 0.008914980106055737, 0.08675380796194077,
          0.6736476130317897,
        ],
      ],
    ];
    for (const [seed, expected] of golden) {
      const r = makeRng(seed);
      expect([r(), r(), r(), r()]).toEqual(expected);
    }
  });
});
