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

  it('stretches its root to the container so height-fit and fill work in plain block parents', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const handle = mount(container, items);
    expect(handle.el.style.height).toBe('100%');
    handle.destroy();
  });
});

describe('renderTagCloud click handling (#39)', () => {
  it('renders buttons, fires the handler, and unbinds on destroy', async () => {
    const { renderTagCloud } = await import('../src/index.js');
    const container = document.createElement('div');
    document.body.appendChild(container);
    const clicks: string[] = [];
    const handle = renderTagCloud(container, items, {
      onTagClick: (i) => clicks.push(i.label),
    });

    // non-link tags become real buttons; links stay links
    const button = container.querySelector('button.otc-tag') as HTMLElement;
    expect(button).toBeTruthy();
    expect(button.getAttribute('type')).toBe('button');
    expect(container.querySelector('a.otc-tag')).toBeTruthy();

    button.click();
    expect(clicks).toEqual(['Rust']);

    // links fire it too, so callers can preventDefault for routing
    (container.querySelector('a.otc-tag') as HTMLElement).click();
    expect(clicks).toEqual(['Rust', 'JavaScript']);

    // a click inside the nowrap span still resolves to its tag (delegation)
    clicks.length = 0;
    handle.update([{ label: 'tag-cloud', weight: 5 }]);
    (container.querySelector('.otc-nb') as HTMLElement).click();
    expect(clicks).toEqual(['tag-cloud']);

    handle.destroy();
    container.remove();
  });

  it('stays spans when no handler is given', async () => {
    const { renderTagCloud } = await import('../src/index.js');
    const container = document.createElement('div');
    document.body.appendChild(container);
    const handle = renderTagCloud(container, items);
    expect(container.querySelector('button.otc-tag')).toBeNull();
    expect(container.querySelectorAll('span.otc-tag').length).toBeGreaterThan(
      0,
    );
    handle.destroy();
    container.remove();
  });
});

describe('mount() handle parity (#41)', () => {
  it('exposes setFill, like renderTagCloud', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const handle = mount(container, items);
    expect(typeof handle.setFill).toBe('function');
    // toggling a height fill keeps the root stretched so distribution has a
    // height to work against in a plain block parent
    handle.setFill('height');
    expect(handle.el.style.height).toBe('100%');
    handle.setFill(undefined);
    expect(handle.el.style.height).toBe('');
    handle.destroy();
    container.remove();
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
