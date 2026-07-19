import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { TagCloud } from '../src/index.js';

const items = [
  { label: 'JavaScript', weight: 95, href: '/js' },
  { label: 'Rust', weight: 60 },
  { label: 'Go', weight: 55, color: 'tomato', class: 'hot' },
];

describe('TagCloud (vue)', () => {
  it('renders one element per item with the layout-engine contract attributes', () => {
    const wrapper = mount(TagCloud, { props: { items } });
    expect(wrapper.classes()).toContain('otc-cloud');
    const tags = wrapper.findAll('.otc-tag');
    expect(tags).toHaveLength(3);
    for (const tag of tags) {
      expect(tag.attributes('data-fs')).toMatch(/^\d/);
      expect(tag.attributes('data-weight')).toMatch(/^\d/);
      expect(tag.attributes('data-key')).toBeTruthy();
      expect(tag.attributes('title')).toBeTruthy();
    }
  });

  it('renders <a> for items with href, <span> otherwise', () => {
    const wrapper = mount(TagCloud, { props: { items } });
    expect(wrapper.find('a.otc-tag').attributes('href')).toBe('/js');
    expect(wrapper.findAll('span.otc-tag')).toHaveLength(2);
  });

  it('applies per-item class and color custom property', () => {
    const wrapper = mount(TagCloud, { props: { items } });
    const hot = wrapper.find('.otc-tag.hot');
    expect(hot.exists()).toBe(true);
    // Vue normalizes the inline style string (adds a space after the colon)
    expect(hot.attributes('style')).toMatch(/--otc-tag-color:\s*tomato/);
  });

  it('updates the rendered tags when items change', async () => {
    const wrapper = mount(TagCloud, { props: { items } });
    await wrapper.setProps({ items: items.slice(0, 1) });
    expect(wrapper.findAll('.otc-tag')).toHaveLength(1);
  });

  it('mounts and unmounts without throwing', () => {
    const wrapper = mount(TagCloud, { props: { items } });
    expect(() => wrapper.unmount()).not.toThrow();
  });
});
