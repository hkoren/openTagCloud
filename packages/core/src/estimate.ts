import type { TagCloudItem } from './types.js';
import { prepareTags, type PrepareOptions } from './prepare.js';
import { PAD, LOOSEN, widthFactor } from './layout.js';

/**
 * Estimate the packed height of a cloud for a given container width — without
 * a DOM, so it can run during SSR. Emit it as the container's `min-height` to
 * reserve space before hydration and avoid layout shift (CLS):
 *
 * ```svelte
 * <div style="min-height: {estimateCloudHeight(items, 720)}px">
 *   <TagCloud {items} />
 * </div>
 * ```
 *
 * It mirrors the packer's own area-based box-height formula, with text
 * measured by a character-width heuristic instead of the real font metrics,
 * so expect roughly ±25% — enough to absorb the fallback→packed reflow. A
 * fixed-height container is still the zero-shift option.
 */
export function estimateCloudHeight(
  items: TagCloudItem[],
  width: number,
  options: PrepareOptions = {},
): number {
  if (!items.length || width < 2) return 0;
  const wf = widthFactor(width);
  const wide = width >= 380;
  // average advance width of a bold system-font glyph, in em
  const GLYPH = 0.58;
  let area = 0;
  let tallest = 0;
  for (const p of prepareTags(items, options)) {
    const fs = Math.max(8, p.fontPx * wf);
    const textW = p.text.length * fs * GLYPH;
    let w: number;
    let lines = 1;
    if (wide) {
      // nowrap; the packer shrinks anything wider than the container
      w = Math.min(textW, width);
    } else {
      const maxW = Math.min(6.5 * fs, width);
      lines = Math.max(1, Math.ceil(textW / maxW));
      w = Math.min(textW, maxW);
    }
    const h = lines * fs * 0.95; // line-height 0.95
    area += (w + PAD) * (h + PAD);
    tallest = Math.max(tallest, h);
  }
  return Math.ceil(Math.max((area * LOOSEN) / width, tallest));
}
