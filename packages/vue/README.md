# @opentagcloud/vue

Vue 3 adapter for [openTagCloud](https://github.com/hkoren/openTagCloud) — a
dependency-free, self-packing, SSR-friendly tag cloud.

```sh
npm install @opentagcloud/vue
```

```vue
<script setup lang="ts">
import { TagCloud, type TagCloudItem } from '@opentagcloud/vue';

const items: TagCloudItem[] = [
  { label: 'JavaScript', weight: 95, href: '/tags/javascript' },
  { label: 'TypeScript', weight: 88 },
  { label: 'Rust', weight: 60 }, // no href → renders as a <span>
];
</script>

<template>
  <div style="height: 320px">
    <TagCloud :items="items" />
  </div>
</template>
```

SSR/Nuxt-safe: tags render on the server with a justified no-JS fallback, and
the deterministic per-tag scatter keeps server and client markup in sync.

Props (`items`, `min-px`, `max-px`, `fill`), theming custom properties, and the
layout algorithm are documented in the
[project README](https://github.com/hkoren/openTagCloud#readme).

## License

MIT © Henry Koren
