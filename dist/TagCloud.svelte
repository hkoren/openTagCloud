<script lang="ts">
  import { onMount } from 'svelte';
  import type { TagCloudItem } from './types.js';

  let {
    items,
    minPx = 12,
    maxPx = 40,
    fill,
  }: {
    /** The tags to lay out. */
    items: TagCloudItem[];
    /** Font size (px) of the lightest tag. */
    minPx?: number;
    /** Font size (px) of the heaviest tag. */
    maxPx?: number;
    /**
     * `'height'`/`'both'` lets the cloud spread its terms to fill a taller
     * container (e.g. a grid-row sibling) so neighbours stay aligned. Loop-safe:
     * only term positions change, never the container height.
     */
    fill?: 'width' | 'height' | 'both';
  } = $props();
  const fillH = $derived(fill === 'height' || fill === 'both');

  /** Stable key/seed for a tag: its `id`, else its `label`. */
  const keyOf = (t: TagCloudItem) => t.id ?? t.label;

  // Font ramp: lightest term → minPx, heaviest → maxPx (exponential so popular
  // terms tower). Scaled down for many tags / long names; container size and
  // aspect are folded in at measure-time in pack().
  const EXP = 1.9;
  const FLOOR = 9;
  const maxW = $derived(Math.max(1, ...items.map((t) => t.weight)));
  const countFactor = $derived(
    Math.min(1.1, Math.max(0.5, Math.sqrt(18 / Math.max(1, items.length)))),
  );
  function lengthFactor(name: string): number {
    const chars = name.length;
    const longest = Math.max(...name.split(/\s+/).map((w) => w.length));
    return Math.max(
      0.45,
      Math.min(Math.min(1, 15 / Math.max(15, chars)), 11 / Math.max(11, longest)),
    );
  }
  const fontPx = (w: number, name: string) => {
    const ramp = minPx + Math.pow(w / maxW, EXP) * (maxPx - minPx);
    return Math.max(FLOOR, ramp * countFactor * lengthFactor(name));
  };
  // container width → font: shrink on narrow (mobile), grow modestly when wide.
  const widthFactor = (w: number) => Math.min(1.25, Math.max(0.72, w / 460));
  const opacity = (w: number) => 0.62 + Math.pow(w / maxW, 0.8) * 0.38;
  // Render hyphens as non-breaking hyphens so multi-word tags don't wrap on them.
  const label = (name: string) => name.replace(/-/g, '‑');

  // Deterministic per-term RNG (seeded by the tag's key) so the scatter is stable
  // across renders and matches between SSR and hydration.
  function makeRng(seed: string) {
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

  let root: HTMLElement;
  let lastW = -1;
  let lastH = -1;
  // packed base layout (natural top-left of each term) + its natural height;
  // distribute() spreads these to fill the container without re-packing.
  let base: { x: number; y: number; h: number }[] = [];
  let packH = 0;

  const PAD = 5; // gap between boxes

  // Lay the cloud out to fill the container, adapting to its size and aspect
  // ratio. Heaviest terms are seeded at anchor points spread evenly across the
  // box (farthest-point order, so they never cram together); each term then
  // spirals out from its anchor only as far as needed to avoid overlaps. A
  // wide box gets more columns → fewer wrapped lines; corners get seeded so the
  // cloud fills rather than blobbing in the middle.
  function pack() {
    if (!root) return;
    const tags = Array.from(root.querySelectorAll<HTMLElement>('.tag'));
    if (!tags.length) return;
    const W = root.clientWidth;
    if (W < 2) return;
    lastW = W;

    root.classList.remove('packed');
    for (const el of tags) {
      el.style.position = '';
      el.style.left = '';
      el.style.top = '';
    }

    // A wider container can keep multi-word terms on one line (less wrapping);
    // narrow containers wrap at a sensible width. Long single words that would
    // still overflow are shrunk to fit below.
    const wide = W >= 380;
    const setBase = (scale: number) => {
      for (const el of tags) {
        el.style.whiteSpace = wide ? 'nowrap' : 'normal';
        el.style.maxWidth = wide ? `${Math.round(W * 0.6)}px` : 'min(6.5em, 100%)';
        el.style.fontSize = `${Math.max(8, parseFloat(el.dataset.fs || '12') * widthFactor(W) * scale).toFixed(1)}px`;
      }
    };
    const measure = () => tags.map((el) => ({ el, w: el.offsetWidth, h: el.offsetHeight }));

    // Measure the footprint at the width-scaled font. The box HEIGHT is derived
    // purely from the content area (never from the element's own clientHeight),
    // so the layout can't feed back into the container size — the root cause of
    // relayout loops. Width alone (a real external change) drives re-packing.
    setBase(1);
    const dims = measure();
    const area = dims.reduce((s, d) => s + (d.w + PAD) * (d.h + PAD), 0);
    const LOOSEN = 1.4;
    const availH = (area * LOOSEN) / W;

    // shrink any term still wider than the box (unbreakable long word)
    for (const d of dims) {
      if (d.w > W) {
        const cur = parseFloat(d.el.style.fontSize) || 12;
        d.el.style.fontSize = `${Math.max(9, cur * (W / d.w)).toFixed(1)}px`;
        d.w = d.el.offsetWidth;
        d.h = d.el.offsetHeight;
      }
    }

    const n = dims.length;
    const order = dims.map((_, i) => i).sort((a, b) => items[b].weight - items[a].weight);

    // anchor grid sized to the box aspect ratio: wide box → more columns
    const boxH = Math.max(availH, 1);
    const aspect = W / boxH;
    const cols = Math.max(1, Math.round(Math.sqrt(n * aspect)));
    const rows = Math.max(1, Math.ceil(n / cols));
    const cellW = W / cols;
    const cellH = boxH / rows;
    const cells: { x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) cells.push({ x: (c + 0.5) * cellW, y: (r + 0.5) * cellH });

    // order cells farthest-point-first from the box centre, so the heaviest
    // term lands centrally and the next-heaviest spread out to fill/corners.
    const cx0 = W / 2;
    const cy0 = boxH / 2;
    const remaining = cells.slice();
    const ordered: { x: number; y: number }[] = [];
    remaining.sort((a, b) => Math.hypot(a.x - cx0, a.y - cy0) - Math.hypot(b.x - cx0, b.y - cy0));
    ordered.push(remaining.shift()!);
    while (remaining.length) {
      let bi = 0;
      let bd = -1;
      for (let i = 0; i < remaining.length; i++) {
        let md = Infinity;
        for (const o of ordered)
          md = Math.min(md, Math.hypot(remaining[i].x - o.x, remaining[i].y - o.y));
        if (md > bd) {
          bd = md;
          bi = i;
        }
      }
      ordered.push(remaining.splice(bi, 1)[0]);
    }

    const placed: { x: number; y: number; w: number; h: number }[] = [];
    const hits = (x: number, y: number, w: number, h: number) =>
      placed.some(
        (r) => x < r.x + r.w + PAD && x + w + PAD > r.x && y < r.y + r.h + PAD && y + h + PAD > r.y,
      );

    const pos = new Array<{ x: number; y: number }>(n);
    let maxY = 0;
    order.forEach((idx, rank) => {
      const { w, h } = dims[idx];
      const a = ordered[rank % ordered.length];
      const rand = makeRng(keyOf(items[idx]));
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
      placed.push({ x, y, w, h });
      pos[idx] = { x, y };
      maxY = Math.max(maxY, y + h);
    });

    for (const el of tags) el.style.position = 'absolute';
    base = dims.map((d, i) => ({ x: pos[i].x, y: pos[i].y, h: d.h }));
    packH = Math.ceil(maxY);
    root.classList.add('packed');
    root.style.minHeight = `${packH}px`;
    distribute();
  }

  // Spread the packed terms to fill the container's current height when
  // fill='height' (so a cloud in a taller grid cell reaches the bottom and
  // neighbours stay aligned). Terms are position:absolute, so moving them can't
  // change the container's own height — this is loop-safe by construction, unlike
  // reading/writing height during pack().
  function distribute() {
    if (!root || !base.length) return;
    const tags = Array.from(root.querySelectorAll<HTMLElement>('.tag'));
    const H = root.clientHeight;
    lastH = H;
    let sy = 1;
    if (fillH && H > packH + 1) {
      sy = Infinity;
      for (const b of base) if (b.y > 0.5) sy = Math.min(sy, (H - b.h) / b.y);
      if (!isFinite(sy) || sy < 1) sy = 1;
      sy = Math.min(sy, 4); // never spread absurdly far
    }
    tags.forEach((el, i) => {
      const b = base[i];
      if (!b) return;
      const top = sy === 1 ? b.y : Math.min(b.y * sy, Math.max(0, H - b.h));
      el.style.left = `${Math.round(b.x)}px`;
      el.style.top = `${Math.round(top)}px`;
    });
  }

  onMount(() => {
    pack();
    const onResize = () => {
      if (!root) return;
      // Re-pack only on a real WIDTH change. A height change (our own minHeight,
      // or a taller grid-row sibling) just re-distributes — which moves terms but
      // never changes the container height, so it can't feed back into a loop.
      if (Math.abs(root.clientWidth - lastW) > 1) pack();
      else if (Math.abs(root.clientHeight - lastH) > 1) distribute();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(root);
    window.addEventListener('resize', onResize);
    document.fonts?.ready?.then(() => pack());
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  });
</script>

<div class="cloud" bind:this={root}>
  {#each items as t (keyOf(t))}
    {@const fs = fontPx(t.weight, t.label).toFixed(1)}
    {@const style = `font-size:${fs}px;opacity:${opacity(t.weight).toFixed(2)};${
      t.color ? `--otc-tag-color:${t.color};` : ''
    }`}
    {@const title = t.title ?? String(t.weight)}
    {#if t.href}
      <a class="tag {t.class ?? ''}" href={t.href} data-fs={fs} {style} {title}>{label(t.label)}</a>
    {:else}
      <span class="tag {t.class ?? ''}" data-fs={fs} {style} {title}>{label(t.label)}</span>
    {/if}
  {/each}
</div>

<style>
  .cloud {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
  }
  .tag {
    display: inline-block;
    line-height: 0.95;
    text-align: center;
    font-weight: 700;
    /* Per-tag `color` (via --otc-tag-color) wins; then the --otc-color theme
       default; else inherit currentColor. */
    color: var(--otc-tag-color, var(--otc-color, currentColor));
    overflow-wrap: normal;
    word-break: normal;
    hyphens: none;
    text-decoration: none;
    transition:
      color var(--otc-transition, 150ms ease),
      opacity var(--otc-transition, 150ms ease);
  }
  a.tag:hover,
  a.tag:focus-visible {
    /* a per-tag color keeps its hue on hover; otherwise use the theme hover color */
    color: var(--otc-tag-color, var(--otc-hover-color, #2563eb));
    opacity: 1 !important;
    text-decoration: none;
  }
  /* Fallback before JS packs (and no-JS/SSR): justified inline flow. */
  .cloud:not(.packed) {
    text-align: justify;
    text-align-last: justify;
    line-height: 1.15;
  }
  .cloud:not(.packed) .tag {
    margin: 0.18em 0.3em;
    max-width: min(6.5em, 100%);
    vertical-align: middle;
  }
</style>
