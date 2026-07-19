# opentagcloud

A dependency-free, self-packing, SSR-friendly **tag cloud** component for
**Svelte 5** — the Svelte adapter of
[openTagCloud](https://github.com/hkoren/openTagCloud). (Adapters for React,
Vue, Angular, SolidJS, Next.js, and vanilla JS live in the same repo.)

Terms are laid out by a lightweight packer that seeds the heaviest tags across
the container and spirals the rest out from their anchors until nothing
overlaps — so the cloud **fills its container** at any size or aspect ratio.
The scatter is **deterministic** (seeded per tag), so server-rendered and
hydrated output match and the layout is stable across renders.

## Install

```sh
npm install opentagcloud
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
