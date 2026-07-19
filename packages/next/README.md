# @opentagcloud/next

Next.js entry point for [openTagCloud](https://github.com/hkoren/openTagCloud)
— a dependency-free, self-packing, SSR-friendly tag cloud. This package simply
re-exports [`@opentagcloud/react`](https://www.npmjs.com/package/@opentagcloud/react),
whose component ships `'use client'`: in the App Router it server-renders the
justified no-JS fallback, then packs on hydration. Installing the React adapter
directly works identically.

```sh
npm install @opentagcloud/next
```

```tsx
// app/tags/page.tsx
import { TagCloud, type TagCloudItem } from '@opentagcloud/next';

const items: TagCloudItem[] = [
  { label: 'JavaScript', weight: 95, href: '/tags/javascript' },
  { label: 'TypeScript', weight: 88 },
  { label: 'Rust', weight: 60 }, // no href → renders as a <span>
];

export default function Page() {
  return (
    <div style={{ height: 320 }}>
      <TagCloud items={items} />
    </div>
  );
}
```

Props, theming, and the layout algorithm are documented in the
[project README](https://github.com/hkoren/openTagCloud#readme).

## License

MIT © Henry Koren
