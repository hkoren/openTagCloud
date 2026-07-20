# @opentagcloud/solid

SolidJS adapter for [openTagCloud](https://github.com/hkoren/openTagCloud) — a
dependency-free, self-packing, SSR-friendly tag cloud.

```sh
npm install @opentagcloud/solid
```

```tsx
import { TagCloud, type TagCloudItem } from '@opentagcloud/solid';

const items: TagCloudItem[] = [
  { label: 'JavaScript', weight: 95, href: '/tags/javascript' },
  { label: 'TypeScript', weight: 88 },
  { label: 'Rust', weight: 60 }, // no href → renders as a <span>
];

export function Page() {
  return (
    <div style={{ height: '320px' }}>
      <TagCloud items={items} />
    </div>
  );
}
```

Ships two builds: uncompiled Solid JSX under the `solid` export condition
(compiled by vite-plugin-solid alongside your own code, as in every Solid /
SolidStart app), plus a pre-compiled DOM build as the `import`/`default`
entry — so Jest/Vitest in Node, webpack/Rspack, and other setups that don't
transform `node_modules` work out of the box. SSR-safe: the deterministic
per-tag scatter keeps server and hydrated markup in sync.

Props (`items`, `minPx`, `maxPx`, `fill`, `class`), theming custom properties,
and the layout algorithm are documented in the
[project README](https://github.com/hkoren/openTagCloud#readme).

## License

MIT © Henry Koren
