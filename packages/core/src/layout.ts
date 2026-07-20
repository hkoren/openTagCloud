import type { Fill } from './types.js';
import { injectStyles } from './styles.js';
import { makeRng } from './rng.js';

export interface TagCloudLayoutOptions {
  /** Also spread terms vertically to fill the container's height. */
  fill?: Fill;
  /**
   * Add the component stylesheet to the document on `attach()` (default true).
   * Set false if you serve `@opentagcloud/core/styles.css` yourself.
   */
  injectStyles?: boolean;
  /**
   * Keep unchanged tags in place when `refresh()` runs after an item update:
   * tags whose measured box still fits at its old position stay put; only
   * new, resized, or displaced tags are re-placed (seeded from their old
   * position, so they move minimally). Falls back to a full re-pack when the
   * width changed or more than 40% of tags would move. Off by default — a
   * full re-pack always produces the canonical deterministic layout.
   */
  incremental?: boolean;
}

/** @internal Gap between tag boxes; shared with estimateCloudHeight(). */
export const PAD = 5;
/** @internal Area slack factor used to derive the packing box height. */
export const LOOSEN = 1.4;

/** @internal container width → font: shrink on narrow (mobile), grow modestly when wide. */
export const widthFactor = (w: number): number =>
  Math.min(1.25, Math.max(0.72, w / 460));

type Rect = { x: number; y: number; w: number; h: number };

// Collision testing via a spatial hash: placed rects are bucketed into a
// coarse grid so each probe checks only nearby rects instead of every placed
// rect (a naive scan is O(n² × probes) and janks at a few hundred tags).
// PAD-padded overlap semantics, strict interior.
function createSpatialHash() {
  const BUCKET = 64;
  const buckets = new Map<number, Rect[]>();
  const bucketKey = (bx: number, by: number) => by * 8192 + bx;
  const bucketRange = (x: number, y: number, w: number, h: number) => [
    Math.max(0, Math.floor((x - PAD) / BUCKET)),
    Math.max(0, Math.floor((x + w + PAD) / BUCKET)),
    Math.max(0, Math.floor((y - PAD) / BUCKET)),
    Math.max(0, Math.floor((y + h + PAD) / BUCKET)),
  ];
  return {
    insert(r: Rect): void {
      const [x0, x1, y0, y1] = bucketRange(r.x, r.y, r.w, r.h);
      for (let by = y0; by <= y1; by++)
        for (let bx = x0; bx <= x1; bx++) {
          const k = bucketKey(bx, by);
          let list = buckets.get(k);
          if (!list) buckets.set(k, (list = []));
          list.push(r);
        }
    },
    hits(x: number, y: number, w: number, h: number): boolean {
      const [x0, x1, y0, y1] = bucketRange(x, y, w, h);
      for (let by = y0; by <= y1; by++)
        for (let bx = x0; bx <= x1; bx++) {
          const list = buckets.get(bucketKey(bx, by));
          if (!list) continue;
          for (const r of list)
            if (
              x < r.x + r.w + PAD &&
              x + w + PAD > r.x &&
              y < r.y + r.h + PAD &&
              y + h + PAD > r.y
            )
              return true;
        }
      return false;
    },
  };
}

/**
 * The self-packing layout engine. Framework-free: it operates on a container
 * element whose children carry class `otc-tag` plus three data attributes —
 * `data-fs` (base font px), `data-weight`, and `data-key` (scatter seed) — all
 * emitted by `prepareTags()`. How those elements got into the DOM (a framework
 * template, `renderTagCloud()`, or server-rendered HTML) is irrelevant.
 *
 * Lifecycle: construct with the container, call `attach()` once it's in the
 * document, `refresh()` after the tag elements change, `destroy()` on teardown.
 * All methods are no-ops without a DOM, so adapters can call them under SSR.
 *
 * Re-packs and re-distributions animate: moved tags FLIP from their previous
 * visual position, new tags scale in. Duration/easing come from the
 * `--otc-move-transition` custom property (default `250ms` ease-out); set it
 * to `0s` or `none` to disable, and `prefers-reduced-motion: reduce` disables
 * it automatically. The initial pack never animates.
 */
export class TagCloudLayout {
  #root: HTMLElement;
  #fill?: Fill;
  #injectStyles: boolean;
  #incremental: boolean;
  #lastW = -1;
  #lastH = -1;
  // packed base layout (natural top-left of each term) + its natural height;
  // distribute() spreads these to fill the container without re-packing.
  #base: { x: number; y: number; h: number }[] = [];
  #packH = 0;
  // last packed geometry, keyed by data-key — feeds incremental refresh
  #placed = new Map<string, Rect>();
  #packW = -1;
  // fit-mode font scale of the last pack — incremental refresh must measure
  // at the same scale or every kept tag would look "changed"
  #packScale = 1;
  #ro?: ResizeObserver;
  #onResize?: () => void;
  #destroyed = false;

  constructor(root: HTMLElement, options: TagCloudLayoutOptions = {}) {
    this.#root = root;
    this.#fill = options.fill;
    this.#injectStyles = options.injectStyles ?? true;
    this.#incremental = options.incremental ?? false;
  }

  get #fillH(): boolean {
    return this.#fill === 'height' || this.#fill === 'both';
  }

  #tags(): HTMLElement[] {
    return Array.from(this.#root.querySelectorAll<HTMLElement>('.otc-tag'));
  }

  /** Start observing the container and pack the initial layout. */
  attach(): void {
    if (typeof window === 'undefined' || this.#destroyed) return;
    if (this.#injectStyles) injectStyles(this.#root.ownerDocument);
    this.pack();
    // Coalesce resize bursts (interactive window drags fire many observations
    // per frame) into at most one layout pass per animation frame.
    let raf = 0;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (this.#destroyed) return;
        // Re-pack only on a real WIDTH change. A height change (our own minHeight,
        // or a taller grid-row sibling) just re-distributes — which moves terms but
        // never changes the container height, so it can't feed back into a loop.
        if (Math.abs(this.#root.clientWidth - this.#lastW) > 1) this.pack();
        else if (Math.abs(this.#root.clientHeight - this.#lastH) > 1)
          this.distribute();
      });
    };
    this.#onResize = onResize;
    this.#ro = new ResizeObserver(onResize);
    this.#ro.observe(this.#root);
    window.addEventListener('resize', onResize);
    document.fonts?.ready?.then(() => {
      if (!this.#destroyed) this.pack();
    });
  }

  /** Re-pack after the tag elements changed (items added/removed/re-weighted). */
  refresh(): void {
    if (typeof window === 'undefined' || this.#destroyed) return;
    if (this.#incremental && this.#tryIncremental()) return;
    this.pack();
  }

  /** Change the fill mode; only term positions move, never the container height. */
  setFill(fill: Fill | undefined): void {
    this.#fill = fill;
    if (typeof window !== 'undefined' && !this.#destroyed) this.distribute();
  }

  /** Stop observing. The current positions are left in place. */
  destroy(): void {
    this.#destroyed = true;
    this.#ro?.disconnect();
    this.#ro = undefined;
    if (this.#onResize && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.#onResize);
    }
    this.#onResize = undefined;
  }

  // ---------- movement animation (FLIP) ----------

  // Animations are on unless the user asked for reduced motion or zeroed the
  // --otc-move-transition custom property.
  #moveEnabled(): boolean {
    if (
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return false;
    const v = getComputedStyle(this.#root)
      .getPropertyValue('--otc-move-transition')
      .trim();
    return v !== 'none' && v !== '0s' && v !== '0ms';
  }

  // Visual positions (including any in-flight transform) relative to the root,
  // keyed by data-key — so interrupted animations hand off smoothly.
  #snapshot(tags: HTMLElement[]): Map<string, { x: number; y: number }> {
    const rootRect = this.#root.getBoundingClientRect();
    const map = new Map<string, { x: number; y: number }>();
    for (const el of tags) {
      const r = el.getBoundingClientRect();
      map.set(el.dataset.key ?? '', {
        x: r.left - rootRect.left,
        y: r.top - rootRect.top,
      });
    }
    return map;
  }

  // Classic FLIP: positions are already final; put each moved tag back at its
  // old visual spot with a transform, flush, then release the transform so the
  // stylesheet's `transform var(--otc-move-transition)` rule animates it home.
  // Tags with no previous position (new items) scale in instead.
  #playFlip(
    tags: HTMLElement[],
    from: Map<string, { x: number; y: number }>,
  ): void {
    // Kill any running transition first so measurements see resting positions.
    for (const el of tags) {
      el.style.transition = 'none';
      el.style.transform = '';
    }
    const rootRect = this.#root.getBoundingClientRect();
    const now = tags.map((el) => {
      const r = el.getBoundingClientRect();
      return { el, x: r.left - rootRect.left, y: r.top - rootRect.top };
    });
    let any = false;
    for (const { el, x, y } of now) {
      const prev = from.get(el.dataset.key ?? '');
      if (prev) {
        const dx = prev.x - x;
        const dy = prev.y - y;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
          any = true;
        }
      } else {
        el.style.transform = 'scale(0.5)';
        any = true;
      }
    }
    if (any) void this.#root.offsetWidth; // flush the start state
    for (const el of tags) {
      el.style.transition = '';
      el.style.transform = '';
    }
  }

  // ---------- layout ----------

  // Lay the cloud out to fill the container, adapting to its size and aspect
  // ratio. Heaviest terms are seeded at anchor points spread evenly across the
  // box (farthest-point order, so they never cram together); each term then
  // spirals out from its anchor only as far as needed to avoid overlaps. A
  // wide box gets more columns → fewer wrapped lines; corners get seeded so the
  // cloud fills rather than blobbing in the middle.
  pack(): void {
    const root = this.#root;
    const tags = this.#tags();
    if (!tags.length) return;
    const W = root.clientWidth;
    if (W < 2) return;
    this.#lastW = W;

    // FLIP source: visual positions before anything moves (never on the
    // initial pack — the fallback→packed swap should not zoom every tag).
    const flipFrom =
      root.classList.contains('otc-packed') && this.#moveEnabled()
        ? this.#snapshot(tags)
        : null;

    const weights = tags.map((el) => {
      const w = parseFloat(el.dataset.weight ?? '');
      return Number.isFinite(w) ? w : 1;
    });
    const keys = tags.map((el) => el.dataset.key ?? el.textContent ?? '');

    // Probe for an externally imposed height (fixed/flex/grid parents): with
    // our own minHeight zeroed and every tag out of flow, any height left must
    // come from outside. Auto-height containers probe as 0, which preserves
    // the no-feedback-loop invariant — we never fit to a height we caused.
    const prevMinHeight = root.style.minHeight;
    const prevPositions = tags.map((el) => el.style.position);
    root.style.minHeight = '0px';
    for (const el of tags) el.style.position = 'absolute';
    const externalH = root.clientHeight;
    root.style.minHeight = prevMinHeight;
    tags.forEach((el, i) => (el.style.position = prevPositions[i]));
    // Fit mode (#16): scale the whole font ramp so the cloud fills the box —
    // bigger type, less dead space — instead of packing to its natural area.
    const fit = externalH > 40;

    root.classList.remove('otc-packed');
    for (const el of tags) {
      el.style.position = '';
      el.style.left = '';
      el.style.insetInlineStart = '';
      el.style.top = '';
      el.style.transform = '';
    }

    // A wider container can keep multi-word terms on one line (less wrapping);
    // narrow containers wrap at a sensible width. Long single words that would
    // still overflow are shrunk to fit below.
    const wide = W >= 380;
    const setBase = (scale: number) => {
      for (const el of tags) {
        el.style.whiteSpace = wide ? 'nowrap' : 'normal';
        el.style.maxWidth = wide
          ? `${Math.round(W * 0.6)}px`
          : 'min(6.5em, 100%)';
        el.style.fontSize = `${Math.max(8, parseFloat(el.dataset.fs || '12') * widthFactor(W) * scale).toFixed(1)}px`;
      }
    };
    const measure = () =>
      tags.map((el) => ({ el, w: el.offsetWidth, h: el.offsetHeight }));

    // Measure the footprint at the width-scaled font. Without an external
    // height, the box HEIGHT is derived purely from the content area (never
    // from the element's own clientHeight), so the layout can't feed back into
    // the container size — the root cause of relayout loops. Width alone (a
    // real external change) drives re-packing.
    setBase(1);
    let dims = measure();
    const baseArea = dims.reduce((s, d) => s + (d.w + PAD) * (d.h + PAD), 0);

    // Fit mode: project the font scale whose footprint fills the external box,
    // then verify by packing — a single bounded retry shrinks on overflow.
    let scale = 1;
    if (fit && baseArea > 0) {
      scale = Math.min(
        2.5,
        Math.max(0.6, Math.sqrt((W * externalH) / (baseArea * LOOSEN))),
      );
    }

    const n = dims.length;
    const order = dims.map((_, i) => i).sort((a, b) => weights[b] - weights[a]);

    let pos = new Array<{ x: number; y: number }>(n);
    let maxY = 0;

    const ATTEMPTS = 3;
    for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
      if (scale !== 1 || attempt > 0) {
        setBase(scale);
        dims = measure();
      }
      // shrink any term still wider than the box (unbreakable long word)
      for (const d of dims) {
        if (d.w > W) {
          const cur = parseFloat(d.el.style.fontSize) || 12;
          d.el.style.fontSize = `${Math.max(9, cur * (W / d.w)).toFixed(1)}px`;
          d.w = d.el.offsetWidth;
          d.h = d.el.offsetHeight;
        }
      }

      const area = dims.reduce((s, d) => s + (d.w + PAD) * (d.h + PAD), 0);
      // anchor grid sized to the box aspect ratio: wide box → more columns
      const boxH = Math.max(fit ? externalH : (area * LOOSEN) / W, 1);
      const aspect = W / boxH;
      const cols = Math.max(1, Math.round(Math.sqrt(n * aspect)));
      const rows = Math.max(1, Math.ceil(n / cols));
      const cellW = W / cols;
      const cellH = boxH / rows;
      const cells: { x: number; y: number }[] = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          cells.push({ x: (c + 0.5) * cellW, y: (r + 0.5) * cellH });

      // order cells farthest-point-first from the box centre, so the heaviest
      // term lands centrally and the next-heaviest spread out to fill/corners.
      // Incremental farthest-point selection: each remaining cell tracks its
      // min distance to the ordered set, updated only against the newly added
      // point — O(n²) total (a naive rescan is O(n³) and janks at a few
      // hundred tags) while selecting the exact same sequence.
      const cx0 = W / 2;
      const cy0 = boxH / 2;
      const remaining = cells.slice();
      const ordered: { x: number; y: number }[] = [];
      remaining.sort(
        (a, b) =>
          Math.hypot(a.x - cx0, a.y - cy0) - Math.hypot(b.x - cx0, b.y - cy0),
      );
      ordered.push(remaining.shift()!);
      const minDist = remaining.map((c) =>
        Math.hypot(c.x - ordered[0].x, c.y - ordered[0].y),
      );
      while (remaining.length) {
        let bi = 0;
        let bd = -1;
        for (let i = 0; i < remaining.length; i++) {
          if (minDist[i] > bd) {
            bd = minDist[i];
            bi = i;
          }
        }
        const next = remaining.splice(bi, 1)[0];
        minDist.splice(bi, 1);
        ordered.push(next);
        for (let i = 0; i < remaining.length; i++) {
          const d = Math.hypot(
            remaining[i].x - next.x,
            remaining[i].y - next.y,
          );
          if (d < minDist[i]) minDist[i] = d;
        }
      }

      const { insert, hits } = createSpatialHash();

      pos = new Array<{ x: number; y: number }>(n);
      maxY = 0;
      order.forEach((idx, rank) => {
        const { w, h } = dims[idx];
        const a = ordered[rank % ordered.length];
        const rand = makeRng(keys[idx]);
        // spiral out from this term's own anchor until it fits with no overlap
        let angle = rand() * Math.PI * 2;
        let radius = 0;
        let x = a.x - w / 2;
        let y = a.y - h / 2;
        let steps = 0;
        while (true) {
          x = a.x - w / 2 + radius * Math.cos(angle);
          y = a.y - h / 2 + radius * Math.sin(angle);
          x = Math.max(0, Math.min(x, W - w)); // stay within width
          if (y < 0) y = 0;
          if (!hits(x, y, w, h)) break;
          angle += 0.5;
          radius += Math.max(3, Math.min(cellW, cellH) * 0.12);
          if (++steps > 4000) break;
        }
        insert({ x, y, w, h });
        pos[idx] = { x, y };
        maxY = Math.max(maxY, y + h);
      });

      // fits (with 8% grace) or we're out of retries — done
      if (!fit || attempt === ATTEMPTS - 1 || maxY <= externalH * 1.08) break;
      scale = Math.max(0.5, scale * (externalH / maxY) * 0.95);
    }

    for (const el of tags) el.style.position = 'absolute';
    this.#base = dims.map((d, i) => ({ x: pos[i].x, y: pos[i].y, h: d.h }));
    this.#packH = Math.ceil(maxY);
    this.#packW = W;
    this.#packScale = scale;
    this.#placed = new Map(
      dims.map((d, i) => [
        keys[i],
        { x: pos[i].x, y: pos[i].y, w: d.w, h: d.h },
      ]),
    );
    root.classList.add('otc-packed');
    root.style.minHeight = `${this.#packH}px`;
    this.distribute(flipFrom);
  }

  // Incremental refresh (opt-in): keep every tag whose measured box still fits
  // at its previous position; spiral only new/changed/displaced tags out from
  // their old spot. Returns false to request a full pack (width changed, no
  // prior layout, or too much churn).
  #tryIncremental(): boolean {
    const root = this.#root;
    const tags = this.#tags();
    if (!tags.length) return false;
    const W = root.clientWidth;
    if (W < 2) return false;
    if (!this.#placed.size || Math.abs(W - this.#packW) > 1) return false;

    const flipFrom = this.#moveEnabled()
      ? new Map([...this.#placed].map(([k, r]) => [k, { x: r.x, y: r.y }]))
      : null;

    const weights = tags.map((el) => {
      const w = parseFloat(el.dataset.weight ?? '');
      return Number.isFinite(w) ? w : 1;
    });
    const keys = tags.map((el) => el.dataset.key ?? el.textContent ?? '');

    // style + measure exactly like pack() so kept tags keep identical boxes
    const wide = W >= 380;
    for (const el of tags) {
      el.style.whiteSpace = wide ? 'nowrap' : 'normal';
      el.style.maxWidth = wide
        ? `${Math.round(W * 0.6)}px`
        : 'min(6.5em, 100%)';
      el.style.fontSize = `${Math.max(8, parseFloat(el.dataset.fs || '12') * widthFactor(W) * this.#packScale).toFixed(1)}px`;
      el.style.transform = '';
    }
    const dims = tags.map((el) => ({
      el,
      w: el.offsetWidth,
      h: el.offsetHeight,
    }));
    for (const d of dims) {
      if (d.w > W) {
        const cur = parseFloat(d.el.style.fontSize) || 12;
        d.el.style.fontSize = `${Math.max(9, cur * (W / d.w)).toFixed(1)}px`;
        d.w = d.el.offsetWidth;
        d.h = d.el.offsetHeight;
      }
    }

    const n = dims.length;
    const order = dims.map((_, i) => i).sort((a, b) => weights[b] - weights[a]);
    const { insert, hits } = createSpatialHash();
    const pos = new Array<{ x: number; y: number }>(n);
    const toPlace: number[] = [];

    // Keep unchanged tags in place (heavier tags claim their spot first).
    for (const idx of order) {
      const old = this.#placed.get(keys[idx]);
      const { w, h } = dims[idx];
      if (
        old &&
        Math.abs(old.w - w) <= 1 &&
        Math.abs(old.h - h) <= 1 &&
        old.x + w <= W + 1 &&
        !hits(old.x, old.y, w, h)
      ) {
        insert({ x: old.x, y: old.y, w, h });
        pos[idx] = { x: old.x, y: old.y };
      } else {
        toPlace.push(idx);
      }
    }
    // Too much churn — the canonical full pack will look better.
    if (toPlace.length > n * 0.4) return false;

    const step = Math.max(
      3,
      Math.sqrt((W * Math.max(this.#packH, 1)) / Math.max(n, 1)) * 0.12,
    );
    let maxY = 0;
    for (const p of pos) if (p) maxY = Math.max(maxY, p.y);
    for (const idx of toPlace) {
      const { w, h } = dims[idx];
      const old = this.#placed.get(keys[idx]);
      const rand = makeRng(keys[idx]);
      let angle = rand() * Math.PI * 2;
      // spiral out from the old spot; new tags start at a deterministic
      // seed point inside the current cloud bounds
      const ax = old ? old.x + old.w / 2 : rand() * W;
      const ay = old ? old.y + old.h / 2 : rand() * Math.max(this.#packH, 1);
      let radius = 0;
      let x = ax - w / 2;
      let y = ay - h / 2;
      let steps = 0;
      while (true) {
        x = ax - w / 2 + radius * Math.cos(angle);
        y = ay - h / 2 + radius * Math.sin(angle);
        x = Math.max(0, Math.min(x, W - w));
        if (y < 0) y = 0;
        if (!hits(x, y, w, h)) break;
        angle += 0.5;
        radius += step;
        if (++steps > 4000) break;
      }
      insert({ x, y, w, h });
      pos[idx] = { x, y };
    }

    maxY = 0;
    for (let i = 0; i < n; i++) maxY = Math.max(maxY, pos[i].y + dims[i].h);

    for (const el of tags) el.style.position = 'absolute';
    this.#base = dims.map((d, i) => ({ x: pos[i].x, y: pos[i].y, h: d.h }));
    this.#packH = Math.ceil(maxY);
    this.#packW = W;
    this.#lastW = W;
    this.#placed = new Map(
      dims.map((d, i) => [
        keys[i],
        { x: pos[i].x, y: pos[i].y, w: d.w, h: d.h },
      ]),
    );
    root.classList.add('otc-packed');
    root.style.minHeight = `${this.#packH}px`;
    this.distribute(flipFrom);
    return true;
  }

  // Spread the packed terms to fill the container's current height when
  // fill='height' (so a cloud in a taller grid cell reaches the bottom and
  // neighbours stay aligned). Terms are position:absolute, so moving them can't
  // change the container's own height — this is loop-safe by construction, unlike
  // reading/writing height during pack().
  //
  // `flipFrom` is internal plumbing from pack()/refresh(): the pre-layout
  // visual positions to animate from (null = don't animate). When called with
  // no argument (height resize, setFill), it snapshots itself.
  distribute(flipFrom?: Map<string, { x: number; y: number }> | null): void {
    const base = this.#base;
    if (!base.length) return;
    const tags = this.#tags();
    if (flipFrom === undefined) {
      flipFrom =
        this.#root.classList.contains('otc-packed') && this.#moveEnabled()
          ? this.#snapshot(tags)
          : null;
    }
    const H = this.#root.clientHeight;
    this.#lastH = H;
    let sy = 1;
    if (this.#fillH && H > this.#packH + 1) {
      sy = Infinity;
      for (const b of base) if (b.y > 0.5) sy = Math.min(sy, (H - b.h) / b.y);
      if (!isFinite(sy) || sy < 1) sy = 1;
      sy = Math.min(sy, 4); // never spread absurdly far
    }
    tags.forEach((el, i) => {
      const b = base[i];
      if (!b) return;
      const top = sy === 1 ? b.y : Math.min(b.y * sy, Math.max(0, H - b.h));
      // logical inline offset: measured from the left in LTR, from the
      // right in RTL — the whole layout mirrors for RTL documents (#11)
      el.style.insetInlineStart = `${Math.round(b.x)}px`;
      el.style.top = `${Math.round(top)}px`;
    });
    if (flipFrom) this.#playFlip(tags, flipFrom);
  }
}
