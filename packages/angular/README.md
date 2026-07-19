# @opentagcloud/angular

Angular adapter for [openTagCloud](https://github.com/hkoren/openTagCloud) — a
dependency-free, self-packing, SSR-friendly tag cloud. Standalone component,
Angular 17+.

```sh
npm install @opentagcloud/angular
```

```ts
import { Component } from '@angular/core';
import { TagCloudComponent, type TagCloudItem } from '@opentagcloud/angular';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [TagCloudComponent],
  template: `
    <div style="height: 320px">
      <otc-tag-cloud [items]="items" />
    </div>
  `,
})
export class TagsComponent {
  items: TagCloudItem[] = [
    { label: 'JavaScript', weight: 95, href: '/tags/javascript' },
    { label: 'TypeScript', weight: 88 },
    { label: 'Rust', weight: 60 }, // no href → renders as a <span>
  ];
}
```

Inputs: `items` (required), `minPx`, `maxPx`, `fill`.

Styles are injected at runtime, so no build config is needed. With Angular SSR,
optionally add the stylesheet so the no-JS fallback is styled before hydration:

```jsonc
// angular.json → projects.<app>.architect.build.options.styles
"styles": ["node_modules/@opentagcloud/core/dist/styles.css", ...]
```

Theming custom properties and the layout algorithm are documented in the
[project README](https://github.com/hkoren/openTagCloud#readme).

## Publishing (maintainers)

ng-packagr writes the publishable package to `dist/`:
`npm run build && npm publish dist`.

## License

MIT © Henry Koren
