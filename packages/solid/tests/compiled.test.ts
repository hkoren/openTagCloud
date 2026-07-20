// Verifies the compiled DOM fallback (#9): the `import`/`default` entry is
// plain JavaScript that renders without vite-plugin-solid — the situation of
// Jest/webpack consumers. Note: no JSX in this file, and the import goes to
// the built dist (run `npm run build -w @opentagcloud/solid` first).
import { describe, expect, it } from 'vitest';
import { render } from 'solid-js/web';
// eslint-disable-next-line import/no-unresolved
import { TagCloud } from '../dist/index.js';

describe('compiled fallback (dist/index.js)', () => {
  it('renders without the solid JSX transform', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const dispose = render(
      () =>
        TagCloud({
          items: [
            { label: 'JavaScript', weight: 95, href: '/js' },
            { label: 'Rust', weight: 60 },
          ],
        }),
      container,
    );
    expect(container.querySelectorAll('.otc-tag')).toHaveLength(2);
    expect(container.querySelector('a.otc-tag')?.getAttribute('href')).toBe(
      '/js',
    );
    dispose();
    container.remove();
  });
});
