# @opentagcloud/react

React adapter for [openTagCloud](https://github.com/hkoren/openTagCloud) — a
dependency-free, self-packing, SSR-friendly tag cloud.

```sh
npm install @opentagcloud/react
```

```tsx
import { TagCloud, type TagCloudItem } from '@opentagcloud/react';

const items: TagCloudItem[] = [
  { label: 'JavaScript', weight: 95, href: '/tags/javascript' },
  { label: 'TypeScript', weight: 88 },
  { label: 'Rust', weight: 60 }, // no href → renders as a <span>
];

export function Page() {
  return (
    <div style={{ height: 320 }}>
      <TagCloud items={items} />
    </div>
  );
}
```

Works in Next.js as-is — the component ships `'use client'`, so it drops into
the App Router and still server-renders the justified no-JS fallback
(`@opentagcloud/next` is the same component under a Next-flavored name).

Props (`items`, `minPx`, `maxPx`, `fill`, `className`), theming custom
properties, and the layout algorithm are documented in the
[project README](https://github.com/hkoren/openTagCloud#readme).

## License

MIT © Henry Koren
