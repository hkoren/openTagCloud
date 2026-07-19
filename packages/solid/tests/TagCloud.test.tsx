import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { afterEach, describe, expect, it } from 'vitest';
import { TagCloud } from '../src/index.js';
import type { TagCloudItem } from '@opentagcloud/core';

const items: TagCloudItem[] = [
  { label: 'JavaScript', weight: 95, href: '/js' },
  { label: 'Rust', weight: 60 },
  { label: 'Go', weight: 55, color: 'tomato', class: 'hot' },
];

let container: HTMLDivElement;
let dispose: (() => void) | undefined;

function mount(ui: () => any) {
  container = document.createElement('div');
  document.body.appendChild(container);
  dispose = render(ui, container);
}

afterEach(() => {
  dispose?.();
  dispose = undefined;
  container?.remove();
});

describe('TagCloud (solid)', () => {
  it('renders one element per item with the layout-engine contract attributes', () => {
    mount(() => <TagCloud items={items} />);
    const cloud = container.querySelector('.otc-cloud')!;
    const tags = cloud.querySelectorAll('.otc-tag');
    expect(tags).toHaveLength(3);
    for (const tag of tags) {
      expect(tag.getAttribute('data-fs')).toMatch(/^\d/);
      expect(tag.getAttribute('data-weight')).toMatch(/^\d/);
      expect(tag.getAttribute('data-key')).toBeTruthy();
      expect(tag.getAttribute('title')).toBeTruthy();
    }
  });

  it('renders <a> for items with href, <span> otherwise', () => {
    mount(() => <TagCloud items={items} />);
    expect(container.querySelector('a.otc-tag')?.getAttribute('href')).toBe(
      '/js',
    );
    expect(container.querySelectorAll('span.otc-tag')).toHaveLength(2);
  });

  it('applies per-item class and color custom property', () => {
    mount(() => <TagCloud items={items} />);
    const hot = container.querySelector('.otc-tag.hot') as HTMLElement;
    expect(hot).toBeTruthy();
    // jsdom re-serializes the style attribute (adds a space after the colon)
    expect(hot.getAttribute('style')).toMatch(/--otc-tag-color:\s*tomato/);
  });

  it('keeps hyphenated labels byte-identical with nowrap word spans (#2)', () => {
    mount(() => <TagCloud items={[{ label: 'tag-cloud demo', weight: 5 }]} />);
    const tag = container.querySelector('.otc-tag')!;
    expect(tag.textContent).toBe('tag-cloud demo');
    expect(tag.querySelector('.otc-nb')?.textContent).toBe('tag-cloud');
  });

  it('sets aria-label when the ariaLabel prop is enabled (#4)', () => {
    mount(() => <TagCloud items={items} ariaLabel />);
    expect(
      container.querySelector('.otc-tag')?.getAttribute('aria-label'),
    ).toBe('JavaScript, weight 95');
  });

  it('updates the rendered tags when items change', () => {
    const [list, setList] = createSignal(items);
    mount(() => <TagCloud items={list()} />);
    expect(container.querySelectorAll('.otc-tag')).toHaveLength(3);
    setList(items.slice(0, 1));
    expect(container.querySelectorAll('.otc-tag')).toHaveLength(1);
  });
});
