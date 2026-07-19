import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TagCloud from '../src/lib/TagCloud.svelte';

const items = [
  { label: 'JavaScript', weight: 95, href: '/js' },
  { label: 'Rust', weight: 60 },
  { label: 'Go', weight: 55, color: 'tomato', class: 'hot' },
];

describe('TagCloud (svelte)', () => {
  it('renders one element per item with the layout-engine contract attributes', () => {
    const { container } = render(TagCloud, { items });
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
    const { container } = render(TagCloud, { items });
    expect(container.querySelector('a.otc-tag')?.getAttribute('href')).toBe(
      '/js',
    );
    expect(container.querySelectorAll('span.otc-tag')).toHaveLength(2);
  });

  it('applies per-item class and color custom property', () => {
    const { container } = render(TagCloud, { items });
    const hot = container.querySelector('.otc-tag.hot') as HTMLElement;
    expect(hot).toBeTruthy();
    // jsdom re-serializes the style attribute (adds a space after the colon)
    expect(hot.getAttribute('style')).toMatch(/--otc-tag-color:\s*tomato/);
  });

  it('keeps hyphenated labels byte-identical with nowrap word spans (#2)', () => {
    const { container } = render(TagCloud, {
      items: [{ label: 'tag-cloud demo', weight: 5 }],
    });
    const tag = container.querySelector('.otc-tag')!;
    expect(tag.textContent).toBe('tag-cloud demo');
    expect(tag.querySelector('.otc-nb')?.textContent).toBe('tag-cloud');
  });

  it('sets aria-label when the ariaLabel prop is enabled (#4)', () => {
    const { container } = render(TagCloud, { items, ariaLabel: true });
    expect(
      container.querySelector('.otc-tag')?.getAttribute('aria-label'),
    ).toBe('JavaScript, weight 95');
  });

  it('updates the rendered tags when items change', async () => {
    const { container, rerender } = render(TagCloud, { items });
    await rerender({ items: items.slice(0, 1) });
    expect(container.querySelectorAll('.otc-tag')).toHaveLength(1);
  });

  it('mounts and unmounts without throwing', () => {
    const { unmount } = render(TagCloud, { items });
    expect(unmount).not.toThrow();
  });
});
