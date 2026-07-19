import type { TagCloudItem } from './types.js';

export interface PrepareOptions {
  /** Font size (px) of the lightest tag. */
  minPx?: number;
  /** Font size (px) of the heaviest tag. */
  maxPx?: number;
  /**
   * Opacity of the lightest tag (heavier tags ramp up to 1). Default 0.62.
   * Raise it (e.g. 0.8) when the theme color would otherwise fall below the
   * WCAG AA contrast ratio at the floor; 1 disables the fade entirely.
   */
  minOpacity?: number;
  /**
   * Accessible name for each tag. `true` emits `"<label>, weight <weight>"`
   * so screen readers hear the ranking that sighted users get from font size;
   * pass a function for custom wording/i18n. Default off (the visible label
   * remains the accessible name).
   */
  ariaLabel?: boolean | ((item: TagCloudItem) => string);
}

/** One run of a tag's label: rendered as-is, or wrapped in a no-wrap span. */
export interface LabelPart {
  /** The exact substring of the label (byte-identical — never rewritten). */
  text: string;
  /**
   * True for hyphenated words: render inside an element with class `otc-nb`
   * (`white-space: nowrap`) so the browser can't break at the hyphen. False
   * parts (plain words and whitespace) render as bare text.
   */
  nowrap: boolean;
}

/**
 * The render-ready view of one tag. Pure data — safe to compute during SSR.
 * Adapters render one element per entry with `className`, `style`, `title`,
 * the `parts` as its content, and the three `data-*` attributes the layout
 * engine reads.
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
  /** The label, verbatim. Prefer rendering `parts` (keeps hyphens unbroken). */
  text: string;
  /**
   * The label split for rendering: hyphenated words become no-wrap parts so
   * tags never line-break at a hyphen, while the DOM text stays byte-identical
   * to the label (copy/paste, find-in-page, and screen readers see the real
   * text — no non-breaking-hyphen substitution).
   */
  parts: LabelPart[];
  /** Base font size in px, before container-width scaling. Render as `data-fs`. */
  fontPx: number;
  /** Weight-derived opacity (lighter tags fade back). */
  opacity: number;
  /** Tooltip text. */
  title: string;
  /** Accessible name; set only when the `ariaLabel` option is enabled. */
  ariaLabel?: string;
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

// Split a label into render parts: hyphenated words get nowrap so the line
// can't break at the hyphen; everything else (plain words AND the whitespace
// between words) merges into ordinary text parts, preserving the label
// byte-for-byte and keeping word boundaries as break opportunities.
function labelParts(label: string): LabelPart[] {
  const parts: LabelPart[] = [];
  for (const token of label.split(/(\s+)/)) {
    if (!token) continue;
    const nowrap = !/\s/.test(token) && token.includes('-');
    const prev = parts[parts.length - 1];
    if (!nowrap && prev && !prev.nowrap) prev.text += token;
    else parts.push({ text: token, nowrap });
  }
  return parts;
}

/**
 * Compute the render-ready view of each tag (font size, opacity, key, label
 * parts, inline style). Pure and DOM-free, so server-rendered and hydrated
 * output match. Adapters call this in their template layer; `TagCloudLayout`
 * then packs the rendered elements on the client.
 */
export function prepareTags(
  items: TagCloudItem[],
  options: PrepareOptions = {},
): PreparedTag[] {
  const { minPx = 12, maxPx = 40, minOpacity = 0.62, ariaLabel } = options;
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
    const opacity = +(
      minOpacity +
      Math.pow(w / maxW, 0.8) * (1 - minOpacity)
    ).toFixed(2);
    return {
      item: t,
      key: keyOf(t),
      weight: w,
      text: t.label,
      parts: labelParts(t.label),
      fontPx,
      opacity,
      title: t.title ?? String(t.weight),
      ariaLabel: ariaLabel
        ? typeof ariaLabel === 'function'
          ? ariaLabel(t)
          : `${t.label}, weight ${t.weight}`
        : undefined,
      className: t.class ? `otc-tag ${t.class}` : 'otc-tag',
      style: `font-size:${fontPx}px;opacity:${opacity};${
        t.color ? `--otc-tag-color:${t.color};` : ''
      }`,
    };
  });
}
