# @opentagcloud/core

Framework-agnostic core of [openTagCloud](https://github.com/hkoren/openTagCloud)
— a dependency-free, self-packing, SSR-friendly tag cloud. This package is the
layout engine plus a vanilla-JS renderer; framework adapters
(`opentagcloud` for Svelte, `@opentagcloud/react`, `@opentagcloud/vue`,
`@opentagcloud/angular`, `@opentagcloud/solid`, `@opentagcloud/next`) are thin
wrappers over it.

## Vanilla usage

```js
import { renderTagCloud } from '@opentagcloud/core';

const cloud = renderTagCloud(document.querySelector('#cloud'), [
  { label: 'JavaScript', weight: 95, href: '/tags/javascript' },
  { label: 'TypeScript', weight: 88 },
  { label: 'Rust', weight: 60, color: 'tomato' },
]);

cloud.update(newItems); // replace items and re-pack
cloud.destroy(); // stop observing, remove tags
```

Give the container a sized parent; the cloud packs to its width and grows its
`min-height` to fit. Styles are injected at runtime — no CSS setup needed. For
server-rendered pages, also ship `@opentagcloud/core/styles.css` so the no-JS
fallback (justified inline flow) is styled before hydration.

## Script tag / custom element (no build step)

The package also ships a browser global (`dist/opentagcloud.vanilla.js`, the
`unpkg`/`jsdelivr` entry) that registers a light-DOM `<otc-tag-cloud>` custom
element and exposes `openTagCloud.mount(container, items, options)`:

```html
<script src="https://unpkg.com/@opentagcloud/core/dist/opentagcloud.vanilla.js"></script>

<otc-tag-cloud
  style="height: 320px"
  items='[{ "label": "Rust", "weight": 60 }]'
>
</otc-tag-cloud>
```

`mount()` and `defineElement()` are also exported from the package root and the
`./vanilla` subpath for ES-module consumers (call `defineElement()` to register
the element). Both are thin wrappers over `renderTagCloud` — same engine, same
markup contract. A runnable page is in
[`examples/vanilla.html`](examples/vanilla.html).

## SSR height estimation

`estimateCloudHeight(items, width, options?)` is pure and DOM-free: emit it as
the container's `min-height` during SSR to reserve space and avoid layout
shift (roughly ±25% of the real packed height).

## Building your own adapter

- `prepareTags(items, { minPx, maxPx })` — pure and DOM-free: returns each
  tag's font size, opacity, key, display text, and inline style. Call it in
  your template layer (works during SSR).
- Render one element per prepared tag with its `className`, `style`, `title`,
  and `data-fs` / `data-weight` / `data-key` attributes, inside a container
  with class `otc-cloud`. Render its `parts` as the content — `nowrap` parts go
  in a `<span class="otc-nb">` so lines never break at a hyphen while the DOM
  text stays byte-identical to the label.
- `new TagCloudLayout(container, { fill }).attach()` on mount; `refresh()`
  after the tags change; `destroy()` on teardown. All methods are no-ops
  without a DOM.

See the [project README](https://github.com/hkoren/openTagCloud#readme) for
props, theming, and how the packer works.

## License

MIT © Henry Koren
