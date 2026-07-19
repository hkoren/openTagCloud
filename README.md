# openTagCloud

A dependency-free, self-packing, SSR-friendly **tag cloud** — a
framework-agnostic core with thin adapters for **Svelte, React, Vue, Angular,
SolidJS, and Next.js** (plus a pure vanilla-JS entry point).

Terms are laid out by a lightweight packer that seeds the heaviest tags across
the container and spirals the rest out from their anchors until nothing
overlaps — so the cloud **fills its container** at any size or aspect ratio
instead of blobbing in the middle. The scatter is **deterministic** (seeded per
tag), so server-rendered and hydrated output match and the layout is stable
across renders.

- 🪶 **Zero runtime dependencies** — the core is plain TypeScript; each adapter
  depends only on the core and its own framework (as a peer).
- 📐 **Responsive** — re-packs on width changes, re-distributes on height changes
  (loop-safe: it never feeds its own height back into layout).
- 🖥️ **SSR-friendly** — every adapter renders the tags server-side with a
  sensible justified fallback before/without JS.
- 🎨 **Themeable** — plain CSS custom properties; inherits `currentColor` by default.
- 🔗 **Links or plain text** — a tag with an `href` renders as an `<a>`, otherwise a `<span>`.

## Packages

| Package                                     | Use with                             | Component                                             |
| ------------------------------------------- | ------------------------------------ | ----------------------------------------------------- |
| [`@opentagcloud/core`](packages/core)       | Vanilla JS / any framework           | `renderTagCloud()`, `TagCloudLayout`, `prepareTags()` |
| [`opentagcloud`](packages/svelte)           | Svelte 5 / SvelteKit                 | `<TagCloud />`                                        |
| [`@opentagcloud/react`](packages/react)     | React 18+ (incl. Next.js)            | `<TagCloud />`                                        |
| [`@opentagcloud/vue`](packages/vue)         | Vue 3 / Nuxt                         | `<TagCloud />`                                        |
| [`@opentagcloud/angular`](packages/angular) | Angular 17+                          | `<otc-tag-cloud />`                                   |
| [`@opentagcloud/solid`](packages/solid)     | SolidJS / SolidStart                 | `<TagCloud />`                                        |
| [`@opentagcloud/next`](packages/next)       | Next.js (alias of the React adapter) | `<TagCloud />`                                        |

## Architecture

All layout logic lives in `@opentagcloud/core`:

- **`prepareTags(items, {minPx, maxPx})`** — pure, DOM-free: computes each
  tag's font size, opacity, key, display text, and inline style. Adapters call
  it in their template layer, so SSR output is identical everywhere.
- **`TagCloudLayout`** — the packer. It operates on a container whose children
  carry class `otc-tag` plus `data-fs` / `data-weight` / `data-key` (all
  emitted by `prepareTags`). It doesn't care how the elements got into the DOM.
- **`renderTagCloud(el, items, opts)`** — vanilla-JS renderer built on both.
- **Styles** — injected at runtime by `TagCloudLayout.attach()` (zero-config),
  and also shipped as `@opentagcloud/core/styles.css` for the no-JS/SSR
  fallback (the runtime injection dedupes when it's already present).

Each adapter (~60–100 lines) renders the prepared tags in its framework's own
template syntax — which is what keeps SSR and hydration native — then hands the
container to `TagCloudLayout` on mount and calls `refresh()` when items change.

## Quick start

### Vanilla JS

```js
import { renderTagCloud } from '@opentagcloud/core';

const cloud = renderTagCloud(document.querySelector('#cloud'), [
  { label: 'JavaScript', weight: 95, href: '/tags/javascript' },
  { label: 'Rust', weight: 60 },
]);
// later: cloud.update(newItems); cloud.destroy();
```

### Svelte 5

```svelte
<script lang="ts">
  import { TagCloud } from 'opentagcloud';
</script>

<div style="height: 320px">
  <TagCloud {items} />
</div>
```

### React / Next.js

```tsx
import { TagCloud } from '@opentagcloud/react'; // or '@opentagcloud/next'

<div style={{ height: 320 }}>
  <TagCloud items={items} />
</div>;
```

The component ships `'use client'`, so it drops straight into the Next.js App
Router and still server-renders the no-JS fallback.

### Vue 3

```vue
<script setup lang="ts">
import { TagCloud } from '@opentagcloud/vue';
</script>

<template>
  <div style="height: 320px"><TagCloud :items="items" /></div>
</template>
```

### Angular

```ts
import { TagCloudComponent } from '@opentagcloud/angular';

@Component({
  standalone: true,
  imports: [TagCloudComponent],
  template: `<div style="height: 320px">
    <otc-tag-cloud [items]="items" />
  </div>`,
})
export class MyComponent {}
```

For a styled no-JS/SSR fallback, also add
`node_modules/@opentagcloud/core/dist/styles.css` to the `styles` array in
`angular.json` (optional — styles are injected at runtime either way).

### SolidJS

```tsx
import { TagCloud } from '@opentagcloud/solid';

<div style={{ height: '320px' }}>
  <TagCloud items={items} />
</div>;
```

(Ships Solid JSX under the `solid` export condition — compiled by
vite-plugin-solid like your own code.)

## Props (identical across adapters)

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
| `id`     | `string?` | Stable identity for the scatter seed + keyed rendering. Defaults to `label`.                    |
| `title`  | `string?` | Tooltip. Defaults to the `weight`.                                                              |
| `color`  | `string?` | Text color for this tag (any CSS color, incl. `var(--…)`). See [Per-tag color](#per-tag-color). |
| `class`  | `string?` | Extra class(es) on the tag element, for custom per-tag styling.                                 |

## Sizing

The cloud fills its parent. **Give the parent a height** (fixed, `flex`, or a
grid row) — the cloud packs to that width and grows its `min-height` to fit.
`minPx`/`maxPx` set the font range; the packer also scales fonts down for
many/long tags and narrow containers.

## Theming

Style it with CSS custom properties (all optional):

| Property            | Default        | Description               |
| ------------------- | -------------- | ------------------------- |
| `--otc-color`       | `currentColor` | Tag text color.           |
| `--otc-hover-color` | `#2563eb`      | Link hover/focus color.   |
| `--otc-transition`  | `150ms ease`   | Color/opacity transition. |

```html
<div style="--otc-color:#a7b0c0; --otc-hover-color:#66e0c0; height:320px">
  <!-- TagCloud here -->
</div>
```

Lighter tags render at lower opacity (heavier = more prominent); hovering a link
brings it to full opacity.

### Per-tag color

Give an individual tag its own color with the `color` field — any CSS color,
including a custom property. It overrides `--otc-color` for that tag and is used
as its hover color too, so it keeps its hue on hover.

For anything beyond color, pass a `class` on the item and target it with a
global rule against the tag class:

```css
.otc-tag.muted {
  font-style: italic;
}
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

This is an npm-workspaces monorepo.

```sh
npm install
npm run build      # build all packages (core first)
npm run dev        # Svelte demo app at /
npm run check      # svelte-check on the Svelte package
```

## Credit

Extracted from the home-page tag cloud on
[neurotransmission.net](https://neurotransmission.net).

## License

[MIT](./LICENSE) © Henry Koren
