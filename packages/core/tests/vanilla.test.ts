// @vitest-environment jsdom
import { beforeAll, describe, expect, it } from 'vitest';
import { defineElement, mount, type TagCloudItem } from '../src/index.js';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  (globalThis as Record<string, unknown>).ResizeObserver ??= ResizeObserverStub;
});

const items: TagCloudItem[] = [
  { label: 'JavaScript', weight: 95, href: '/js' },
  { label: 'Rust', weight: 60 },
];

describe('mount (vanilla compat)', () => {
  it('throws without a container', () => {
    expect(() => mount(null as unknown as HTMLElement, items)).toThrow(
      /container is required/,
    );
  });

  it('creates and owns a child .otc-cloud with the rendered tags', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const handle = mount(container, items);
    expect(handle.el.classList.contains('otc-cloud')).toBe(true);
    expect(handle.el.parentElement).toBe(container);
    expect(handle.el.querySelectorAll('.otc-tag')).toHaveLength(2);
    expect(handle.el.querySelector('a.otc-tag')?.getAttribute('href')).toBe(
      '/js',
    );
    handle.update(items.slice(0, 1));
    expect(handle.el.querySelectorAll('.otc-tag')).toHaveLength(1);
    handle.destroy();
    expect(container.childElementCount).toBe(0);
  });

  it("stretches its root for fill='height' so plain block containers work", () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const handle = mount(container, items, { fill: 'height' });
    expect(handle.el.style.height).toBe('100%');
    handle.destroy();
  });
});

describe('defineElement (<otc-tag-cloud>)', () => {
  it('registers once, renders JSON attribute items, honors the items property', () => {
    defineElement();
    defineElement(); // idempotent
    expect(customElements.get('otc-tag-cloud')).toBeTruthy();

    const el = document.createElement('otc-tag-cloud') as HTMLElement & {
      items: TagCloudItem[];
    };
    el.setAttribute('items', JSON.stringify(items));
    document.body.appendChild(el);
    expect(el.style.display).toBe('block');
    expect(el.querySelectorAll('.otc-tag')).toHaveLength(2);

    el.items = [{ label: 'Only', weight: 5 }];
    expect(el.querySelectorAll('.otc-tag')).toHaveLength(1);

    el.remove();
    expect(el.querySelectorAll('.otc-cloud')).toHaveLength(0);
  });

  it('warns and renders empty on invalid JSON items', () => {
    defineElement();
    const el = document.createElement('otc-tag-cloud');
    el.setAttribute('items', 'not json');
    document.body.appendChild(el);
    expect(el.querySelectorAll('.otc-tag')).toHaveLength(0);
    el.remove();
  });
});
