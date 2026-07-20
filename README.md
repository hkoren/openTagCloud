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

### No build step at all (script tag / custom element)

A script-tag build ships the same engine as a global — it also registers a
light-DOM `<otc-tag-cloud>` custom element, so a tag cloud is literally one
tag (handy for CMS embeds and server-rendered apps):

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
JS (`el.items = [...]` re-renders in place). The global also exposes
`openTagCloud.mount(container, items, options)` →
`{ el, update(items), repack(), destroy() }`, and the same API is importable as
`opentagcloud/vanilla` (or from `@opentagcloud/core`, where it lives). ES-module
consumers register the element explicitly with `defineElement()`. A runnable
page is in [`packages/core/examples/vanilla.html`](packages/core/examples/vanilla.html).

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

| Prop          | Type                            | Default | Description                                                                                                                                                        |
| ------------- | ------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `items`       | `TagCloudItem[]`                | —       | The tags to lay out. **Required.**                                                                                                                                 |
| `minPx`       | `number`                        | `12`    | Font size (px) of the lightest tag.                                                                                                                                |
| `maxPx`       | `number`                        | `40`    | Font size (px) of the heaviest tag.                                                                                                                                |
| `fill`        | `'width' \| 'height' \| 'both'` | —       | Spread terms to also fill the container's **height** (e.g. a grid sibling).                                                                                        |
| `minOpacity`  | `number`                        | `0.62`  | Opacity of the lightest tag. Raise it (e.g. `0.8`) if your theme color falls below WCAG AA contrast at the floor; `1` disables the fade.                           |
| `ariaLabel`   | `boolean \| (item) => string`   | `false` | Accessible name per tag. `true` → `"<label>, weight <weight>"` so screen readers hear the ranking; pass a function for custom wording/i18n.                        |
| `incremental` | `boolean`                       | `false` | Keep unchanged tags in place across item updates — only new/changed tags move (great for live data). Falls back to a full re-pack on width changes or heavy churn. |

### `TagCloudItem`

| Field    | Type      | Description                                                                                                                                                             |
| -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`  | `string`  | Text to display. Tags never line-break at hyphens — enforced with no-wrap markup, so the text itself stays untouched (copy/paste and find-in-page see the real string). |
| `weight` | `number`  | Relative importance — drives font size. Any positive number.                                                                                                            |
| `href`   | `string?` | Optional link. When set, the tag renders as an `<a>`, otherwise a `<span>`.                                                                                             |
| `id`     | `string?` | Stable identity for the scatter seed + keyed rendering. Defaults to `label`.                                                                                            |
| `title`  | `string?` | Tooltip. Defaults to the `weight`.                                                                                                                                      |
| `color`  | `string?` | Text color for this tag (any CSS color, incl. `var(--…)`). See [Per-tag color](#per-tag-color).                                                                         |
| `class`  | `string?` | Extra class(es) on the tag element, for custom per-tag styling.                                                                                                         |

## Sizing

The cloud fills its parent. **Give the parent a height** (fixed, `flex`, or a
grid row) — the cloud packs to that width and grows its `min-height` to fit.
`minPx`/`maxPx` set the font range; the packer also scales fonts down for
many/long tags and narrow containers.

### Avoiding layout shift (CLS)

Before JS packs (SSR, slow networks) the tags render in a justified inline
fallback whose height differs from the packed layout. Two mitigations:

- **Fixed-height container** — the cloud can never shift its siblings. This is
  the zero-shift option and what the demos do.
- **`estimateCloudHeight(items, width, options?)`** — a pure, DOM-free helper
  (SSR-safe) that mirrors the packer's box-height formula, good to roughly
  ±25%. Reserve the space server-side:

  ```svelte
  <div style="min-height: {estimateCloudHeight(items, 720)}px">
    <TagCloud {items} />
  </div>
  ```

## Animations

Re-packs and resizes animate by default: moved tags FLIP smoothly from their
old position to the new one and added tags scale in, driven by the
`--otc-move-transition` custom property (default `250ms` ease-out). The initial
pack never animates, `prefers-reduced-motion: reduce` disables it
automatically, and `--otc-move-transition: 0s` turns it off manually. For
live-updating clouds, combine with `incremental` so existing tags mostly hold
still while new ones slide in.

## Theming

Style it with CSS custom properties (all optional):

| Property                | Default          | Description                                           |
| ----------------------- | ---------------- | ----------------------------------------------------- |
| `--otc-color`           | `currentColor`   | Tag text color.                                       |
| `--otc-hover-color`     | `#2563eb`        | Link hover/focus color.                               |
| `--otc-transition`      | `150ms ease`     | Color/opacity transition.                             |
| `--otc-move-transition` | `250ms` ease-out | Movement (FLIP) animation on re-packs; `0s` disables. |

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

## Accessibility

- Set `ariaLabel` (`true` or a formatting function) so screen readers hear each
  tag's weight, which sighted users infer from font size.
- Lighter tags fade to `minOpacity` (default 0.62). Depending on your theme
  color that can drop below the WCAG AA 4.5:1 contrast ratio — raise
  `minOpacity` or set it to `1` to disable the fade.
- Color/opacity transitions respect `prefers-reduced-motion`.
- Tags are plain links/spans in weight order; consider wrapping the cloud in a
  labeled `<nav>` when it's the page's main navigation.

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

## Releasing

```sh
npm run release          # dry-run rehearsal: verify pipeline + npm publish --dry-run for every package
npm run release -- --yes # publish to npm for real (requires npm login)
```

The script publishes in dependency order (core first, Angular from its
ng-packagr `dist/`), skips versions that are already on the registry (so a
partial run can be re-run), and supports `--tag <dist-tag>` and
`--skip-verify`. First-time setup: `npm login`, and create the
[`opentagcloud` npm org](https://www.npmjs.com/org/create) for the scoped
packages.

## Credit

Extracted from the home-page tag cloud on
[neurotransmission.net](https://neurotransmission.net).

## License

[MIT](./LICENSE) © Henry Koren
