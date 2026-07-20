# opentagcloud

A dependency-free, self-packing, SSR-friendly **tag cloud** — for **any
framework, or none**. This package bundles the **Svelte 5** component, a
**vanilla-JS** entry point (`opentagcloud/vanilla`: `mount()` and the
`<otc-tag-cloud>` custom element — one script tag, no build step), and
re-exports of the framework-agnostic engine. Dedicated **React, Vue, Angular,
SolidJS, and Next.js** adapters ship as
[`@opentagcloud/*`](https://github.com/hkoren/openTagCloud#packages).

**[Live examples →](https://hkoren.github.io/openTagCloud/)**

Terms are laid out by a lightweight packer that seeds the heaviest tags across
the container and spirals the rest out from their anchors until nothing
overlaps — so the cloud **fills its container** at any size or aspect ratio.
The scatter is **deterministic** (seeded per tag), so server-rendered and
hydrated output match and the layout is stable across renders.

## Install

```sh
npm install opentagcloud
```

Svelte 5 is a peer dependency (only if you use the Svelte component — the
vanilla entry point and custom element need no framework at all).

## Usage

No build step (any site, any framework):

```html
<script src="https://unpkg.com/opentagcloud/dist/opentagcloud.vanilla.js"></script>

<otc-tag-cloud
  style="height: 320px"
  items='[
    { "label": "JavaScript", "weight": 95, "href": "/tags/javascript" },
    { "label": "Rust", "weight": 60 }
  ]'
></otc-tag-cloud>
```

Svelte 5:

```svelte
<script lang="ts">
  import { TagCloud, type TagCloudItem } from 'opentagcloud';

  const items: TagCloudItem[] = [
    { label: 'JavaScript', weight: 95, href: '/tags/javascript' },
    { label: 'TypeScript', weight: 88, href: '/tags/typescript' },
    { label: 'Svelte', weight: 70, href: '/tags/svelte' },
    { label: 'Go', weight: 55 }, // no href → renders as a <span>
  ];
</script>

<!-- Give the cloud a sized container; it fills it. -->
<div style="height: 320px">
  <TagCloud {items} />
</div>
```

Props (`items`, `minPx`, `maxPx`, `fill`), the `TagCloudItem` fields, theming
custom properties (`--otc-color`, `--otc-hover-color`, `--otc-transition`,
per-tag `color`), and the layout algorithm are documented in the
[project README](https://github.com/hkoren/openTagCloud#readme).

For custom per-tag styling beyond color, pass a `class` on the item and target
it globally (tag elements carry the `otc-tag` class):

```svelte
<TagCloud items={[{ label: 'Legacy', weight: 20, class: 'muted' }]} />

<style>
  :global(.otc-tag.muted) {
    font-style: italic;
  }
</style>
```

## Development

This package doubles as the repo's demo app:

```sh
npm install        # at the repo root
npm run dev        # demo app at /
npm run check      # svelte-check
npm run build -w opentagcloud
```

## License

MIT © Henry Koren
