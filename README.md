# openTagCloud

A dependency-free, self-packing, SSR-friendly **tag cloud** component for
**Svelte 5**.

Terms are laid out by a lightweight packer that seeds the heaviest tags across
the container and spirals the rest out from their anchors until nothing
overlaps — so the cloud **fills its container** at any size or aspect ratio
instead of blobbing in the middle. The scatter is **deterministic** (seeded per
tag), so server-rendered and hydrated output match and the layout is stable
across renders.

- 🪶 **Zero runtime dependencies** — just Svelte 5.
- 📐 **Responsive** — re-packs on width changes, re-distributes on height changes
  (loop-safe: it never feeds its own height back into layout).
- 🖥️ **SSR-friendly** — renders a sensible justified fallback before/without JS.
- 🎨 **Themeable** — plain CSS custom properties; inherits `currentColor` by default.
- 🔗 **Links or plain text** — a tag with an `href` renders as an `<a>`, otherwise a `<span>`.

## Install

```sh
npm install opentagcloud
```

Or straight from GitHub:

```sh
npm install github:hkoren/openTagCloud
```

Svelte 5 is a peer dependency.

## Usage

```svelte
<script lang="ts">
  import { TagCloud, type TagCloudItem } from 'opentagcloud';

  const items: TagCloudItem[] = [
    { label: 'JavaScript', weight: 95, href: '/tags/javascript' },
    { label: 'TypeScript', weight: 88, href: '/tags/typescript' },
    { label: 'Svelte', weight: 70, href: '/tags/svelte' },
    { label: 'Rust', weight: 60, href: '/tags/rust' },
    { label: 'Go', weight: 55 } // no href → renders as a <span>
  ];
</script>

<!-- Give the cloud a sized container; it fills it. -->
<div style="height: 320px">
  <TagCloud {items} />
</div>
```

## Vanilla / no-build (any framework)

Not using Svelte? A framework-agnostic build ships the same layout engine as a
plain script — no bundler, no Svelte required. Load it and call `mount`:

```html
<div id="cloud" style="height: 320px"></div>

<script src="https://unpkg.com/opentagcloud/dist/opentagcloud.vanilla.js"></script>
<script>
  const items = [
    { label: "JavaScript", weight: 95, href: "/tags/javascript" },
    { label: "TypeScript", weight: 88 },
    { label: "Rust", weight: 60, color: "#c0392b" },
  ];
  const cloud = openTagCloud.mount(document.getElementById("cloud"), items, {
    minPx: 14,
    maxPx: 44,
  });
  // cloud.update(newItems);  // re-render with new tags
  // cloud.destroy();         // remove observers + DOM
</script>
```

Or as an ES module (bundlers, `<script type="module">`, Deno):

```js
import { mount } from "opentagcloud/vanilla";
const cloud = mount(el, items, { minPx: 14, maxPx: 44 });
```

`mount(container, items, options?)` returns `{ el, update(items), repack(), destroy() }`.
`items` use the same `TagCloudItem` shape as the Svelte component, and `options`
accepts `minPx`, `maxPx`, and `fill`. Styling uses the same CSS custom properties
(`--otc-color`, `--otc-hover-color`, per-tag `color`); the base rules are injected
once into `<head>`. A runnable page is in [`examples/vanilla.html`](examples/vanilla.html).

### Custom element

The script-tag build also registers a light-DOM **custom element**, so a tag
cloud is literally one tag — handy for CMS embeds and server-rendered pages:

```html
<script src="https://unpkg.com/opentagcloud/dist/opentagcloud.vanilla.js"></script>

<otc-tag-cloud
  style="height: 320px"
  min-px="14"
  max-px="44"
  items='[
    { "label": "JavaScript", "weight": 95, "href": "/tags/javascript" },
    { "label": "Rust", "weight": 60, "color": "#c0392b" }
  ]'
></otc-tag-cloud>
```

Pass items as a JSON `items` attribute, or assign the `items` **property** from
JS (`el.items = [...]` — updates re-render in place). `min-px`, `max-px`, and
`fill` attributes mirror the `mount` options. ES-module consumers register the
element explicitly:

```js
import { defineElement } from "opentagcloud/vanilla";
defineElement(); // or defineElement('my-tag-cloud')
```

## Props

| Prop    | Type                            | Default | Description                                                                 |
| ------- | ------------------------------- | ------- | --------------------------------------------------------------------------- |
| `items` | `TagCloudItem[]`                | —       | The tags to lay out. **Required.**                                          |
| `minPx` | `number`                        | `12`    | Font size (px) of the lightest tag.                                         |
| `maxPx` | `number`                        | `40`    | Font size (px) of the heaviest tag.                                         |
| `fill`  | `'width' \| 'height' \| 'both'` | —       | Spread terms to also fill the container's **height** (e.g. a grid sibling). |

### `TagCloudItem`

| Field    | Type      | Description                                                                                     |
| -------- | --------- | ----------------------------------------------------------------------------------------------- |
| `label`  | `string`  | Text to display. Hyphens render as non-breaking hyphens so tags don't wrap on them.             |
| `weight` | `number`  | Relative importance — drives font size. Any positive number.                                    |
| `href`   | `string?` | Optional link. When set, the tag renders as an `<a>`, otherwise a `<span>`.                     |
| `id`     | `string?` | Stable identity for the scatter seed + keyed each. Defaults to `label`.                         |
| `title`  | `string?` | Tooltip. Defaults to the `weight`.                                                              |
| `color`  | `string?` | Text color for this tag (any CSS color, incl. `var(--…)`). See [Per-tag color](#per-tag-color). |
| `class`  | `string?` | Extra class(es) on the tag element, for custom per-tag styling.                                 |

## Sizing

The component is `position: relative` and fills its parent. **Give the parent a
height** (fixed, `flex`, or a grid row) — the cloud packs to that width and
grows its `min-height` to fit. `minPx`/`maxPx` set the font range; the packer
also scales fonts down for many/long tags and narrow containers.

## Theming

Style it with CSS custom properties (all optional):

| Property            | Default        | Description               |
| ------------------- | -------------- | ------------------------- |
| `--otc-color`       | `currentColor` | Tag text color.           |
| `--otc-hover-color` | `#2563eb`      | Link hover/focus color.   |
| `--otc-transition`  | `150ms ease`   | Color/opacity transition. |

```svelte
<div style="--otc-color:#a7b0c0; --otc-hover-color:#66e0c0; height:320px">
  <TagCloud {items} />
</div>
```

Lighter tags render at lower opacity (heavier = more prominent); hovering a link
brings it to full opacity.

### Per-tag color

Give an individual tag its own color with the `color` field — any CSS color,
including a custom property. It overrides `--otc-color` for that tag and is used
as its hover color too, so it keeps its hue on hover. Great for highlighting or
categorizing tags (status, sentiment, a "danger" flag, …):

```svelte
<script>
  const items = tags.map((t) => ({
    label: t.name,
    weight: t.weight,
    href: t.href,
    color: t.risky ? 'var(--danger)' : undefined // themed per tag
  }));
</script>

<TagCloud {items} />
```

For anything beyond color, pass a `class` on the item and target it with a global
rule:

```svelte
<TagCloud items={[{ label: 'Legacy', weight: 20, class: 'muted' }]} />

<style>
  :global(.tag.muted) {
    font-style: italic;
  }
</style>
```

## How it works

1. Measure each tag at a width-scaled font size.
2. Build an anchor grid sized to the container's aspect ratio, ordered
   farthest-point-first from the center so the heaviest tag lands centrally and
   the rest spread to the edges and corners.
3. Spiral each tag out from its anchor (seeded RNG) until it no longer overlaps.
4. On resize: re-pack on width changes, re-distribute positions on height changes.

Because tags are absolutely positioned, moving them can never change the
container's own height — the layout can't feed back on itself.

## Development

```sh
npm install
npm run dev        # demo app at /
npm run check      # svelte-check
npm run package    # build the publishable package into dist/
```

## Credit

Extracted from the home-page tag cloud on
[neurotransmission.net](https://neurotransmission.net).

## License

[MIT](./LICENSE) © Henry Koren
