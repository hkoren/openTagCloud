import type { TagCloudItem } from './types.js';

export interface PrepareOptions {
  /** Font size (px) of the lightest tag. */
  minPx?: number;
  /** Font size (px) of the heaviest tag. */
  maxPx?: number;
}

/**
 * The render-ready view of one tag. Pure data — safe to compute during SSR.
 * Adapters render one element per entry with `className`, `style`, `title`,
 * the text, and the three `data-*` attributes the layout engine reads.
 */
export interface PreparedTag {
  /** The original item. */
  item: TagCloudItem;
  /** Stable key: `item.id`, else `item.label`. Render as `data-key`. */
  key: string;
  /**
   * Sanitized weight (negative / non-finite `item.weight` clamped to 0).
   * Render as `data-weight` — the layout engine sorts by it.
   */
  weight: number;
  /** Display text (hyphens replaced with non-breaking hyphens). */
  text: string;
  /** Base font size in px, before container-width scaling. Render as `data-fs`. */
  fontPx: number;
  /** Weight-derived opacity (lighter tags fade back). */
  opacity: number;
  /** Tooltip text. */
  title: string;
  /** `"otc-tag"` plus any `item.class`. */
  className: string;
  /** Inline style string: font-size, opacity, and the per-tag color custom property. */
  style: string;
}

/** Stable key/seed for a tag: its `id`, else its `label`. */
export const keyOf = (t: TagCloudItem): string => t.id ?? t.label;

// Font ramp: lightest term → minPx, heaviest → maxPx (exponential so popular
// terms tower). Scaled down for many tags / long names; container size and
// aspect are folded in at measure-time by the layout engine.
const EXP = 1.9;
const FLOOR = 9;

// Weights outside [0, ∞) would send NaN through the pow() ramps and end up as
// invalid `font-size: NaNpx` / `opacity: NaN` declarations that browsers drop
// silently. Clamp instead, and say so once.
let warnedBadWeight = false;
function sanitizeWeight(w: number): number {
  if (Number.isFinite(w) && w >= 0) return w;
  if (!warnedBadWeight) {
    warnedBadWeight = true;
    console.warn(
      'opentagcloud: negative or non-finite tag weight(s) clamped to 0',
    );
  }
  return 0;
}

function lengthFactor(name: string): number {
  const chars = name.length;
  const longest = Math.max(...name.split(/\s+/).map((w) => w.length));
  return Math.max(
    0.45,
    Math.min(Math.min(1, 15 / Math.max(15, chars)), 11 / Math.max(11, longest)),
  );
}

/**
 * Compute the render-ready view of each tag (font size, opacity, key, text,
 * inline style). Pure and DOM-free, so server-rendered and hydrated output
 * match. Adapters call this in their template layer; `TagCloudLayout` then
 * packs the rendered elements on the client.
 */
export function prepareTags(
  items: TagCloudItem[],
  options: PrepareOptions = {},
): PreparedTag[] {
  const { minPx = 12, maxPx = 40 } = options;
  const weights = items.map((t) => sanitizeWeight(t.weight));
  const maxW = Math.max(1, ...weights);
  const countFactor = Math.min(
    1.1,
    Math.max(0.5, Math.sqrt(18 / Math.max(1, items.length))),
  );
  return items.map((t, i) => {
    const w = weights[i];
    const ramp = minPx + Math.pow(w / maxW, EXP) * (maxPx - minPx);
    const fontPx = +Math.max(
      FLOOR,
      ramp * countFactor * lengthFactor(t.label),
    ).toFixed(1);
    const opacity = +(0.62 + Math.pow(w / maxW, 0.8) * 0.38).toFixed(2);
    return {
      item: t,
      key: keyOf(t),
      weight: w,
      // Non-breaking hyphens so multi-word tags don't wrap on them.
      text: t.label.replace(/-/g, '‑'),
      fontPx,
      opacity,
      title: t.title ?? String(t.weight),
      className: t.class ? `otc-tag ${t.class}` : 'otc-tag',
      style: `font-size:${fontPx}px;opacity:${opacity};${
        t.color ? `--otc-tag-color:${t.color};` : ''
      }`,
    };
  });
}
