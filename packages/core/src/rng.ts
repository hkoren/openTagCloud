/**
 * Deterministic per-term RNG (seeded by the tag's key) so the scatter is stable
 * across renders and matches between SSR and hydration. Exported mainly so the
 * sequence can be pinned by tests — any change to it silently breaks
 * SSR/hydration position parity and should be deliberate.
 */
export function makeRng(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let s = h >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 15), 1 | s) >>> 0;
    s = (s + Math.imul(s ^ (s >>> 7), 61 | s)) >>> 0;
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}
