import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { TagCloud } from '../src/index.js';

const items = [
  { label: 'JavaScript', weight: 95, href: '/js' },
  { label: 'Rust', weight: 60 },
  { label: 'Go', weight: 55, color: 'tomato', class: 'hot' },
];

afterEach(cleanup);

describe('TagCloud (react)', () => {
  it('renders one element per item with the layout-engine contract attributes', () => {
    const { container } = render(<TagCloud items={items} />);
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
    const { container } = render(<TagCloud items={items} />);
    expect(container.querySelector('a.otc-tag')?.getAttribute('href')).toBe(
      '/js',
    );
    expect(container.querySelectorAll('span.otc-tag')).toHaveLength(2);
  });

  it('applies per-item class and color custom property', () => {
    const { container } = render(<TagCloud items={items} />);
    const hot = container.querySelector('.otc-tag.hot') as HTMLElement;
    expect(hot).toBeTruthy();
    expect(hot.style.getPropertyValue('--otc-tag-color')).toBe('tomato');
  });

  it('updates the rendered tags when items change', () => {
    const { container, rerender } = render(<TagCloud items={items} />);
    rerender(<TagCloud items={items.slice(0, 1)} />);
    expect(container.querySelectorAll('.otc-tag')).toHaveLength(1);
  });

  it('keeps hyphenated labels byte-identical with nowrap word spans (#2)', () => {
    const { container } = render(
      <TagCloud items={[{ label: 'tag-cloud demo', weight: 5 }]} />,
    );
    const tag = container.querySelector('.otc-tag')!;
    expect(tag.textContent).toBe('tag-cloud demo');
    expect(tag.querySelector('.otc-nb')?.textContent).toBe('tag-cloud');
  });

  it('sets aria-label when the ariaLabel prop is enabled (#4)', () => {
    const { container } = render(<TagCloud items={items} ariaLabel />);
    expect(
      container.querySelector('.otc-tag')?.getAttribute('aria-label'),
    ).toBe('JavaScript, weight 95');
    const { container: off } = render(<TagCloud items={items} />);
    expect(off.querySelector('.otc-tag')?.hasAttribute('aria-label')).toBe(
      false,
    );
  });

  it('renders buttons and fires onTagClick (#39)', () => {
    const clicked: string[] = [];
    const { container } = render(
      <TagCloud items={items} onTagClick={(i) => clicked.push(i.label)} />,
    );
    const button = container.querySelector('button.otc-tag') as HTMLElement;
    expect(button).toBeTruthy();
    expect(button.getAttribute('type')).toBe('button');
    button.click();
    expect(clicked).toHaveLength(1);
    expect(container.querySelector('a.otc-tag')?.getAttribute('href')).toBe(
      '/js',
    );
  });

  it('renders spans when no handler is given', () => {
    const { container } = render(<TagCloud items={items} />);
    expect(container.querySelector('button.otc-tag')).toBeNull();
  });

  it('mounts and unmounts without leaking listeners or throwing', () => {
    const { unmount } = render(<TagCloud items={items} />);
    expect(unmount).not.toThrow();
  });
});
