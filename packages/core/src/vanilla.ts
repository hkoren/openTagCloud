/**
 * Script-tag / no-build compatibility API, kept source-compatible with the
 * original `opentagcloud/vanilla` build (PR #12) but implemented as thin
 * wrappers over the core renderer so the layout engine exists exactly once.
 */
import type { Fill, TagCloudItem } from './types.js';
import { renderTagCloud } from './render.js';

export interface MountOptions {
  /** Font size (px) of the lightest tag. Default 12. */
  minPx?: number;
  /** Font size (px) of the heaviest tag. Default 40. */
  maxPx?: number;
  /** Spread terms to fill a taller container. */
  fill?: Fill;
}

export interface CloudHandle {
  /** The generated `.otc-cloud` root element. */
  el: HTMLElement;
  /** Replace the items and re-render. */
  update(items: TagCloudItem[]): void;
  /** Force a re-pack. */
  repack(): void;
  /** Disconnect observers and remove the cloud from the DOM. */
  destroy(): void;
}

/**
 * Mount a tag cloud into `container` (a sized element to fill). Unlike
 * `renderTagCloud`, which renders into the element you give it, `mount`
 * creates and owns a child `.otc-cloud` element — matching the original
 * vanilla-build behavior — and removes it again on `destroy()`.
 */
export function mount(
  container: HTMLElement,
  items: TagCloudItem[],
  options: MountOptions = {},
): CloudHandle {
  if (!container) throw new Error('openTagCloud.mount: container is required');
  const doc = container.ownerDocument || document;
  const root = doc.createElement('div');
  // fill='height'/'both' distributes against the root's own height, so the
  // root must inherit the container's height even in a plain (non-flex) parent.
  if (options.fill === 'height' || options.fill === 'both') {
    root.style.height = '100%';
  }
  container.appendChild(root);
  const handle = renderTagCloud(root, items, options);
  return {
    el: root,
    update: (next) => handle.update(next),
    repack: () => handle.repack(),
    destroy() {
      handle.destroy();
      root.remove();
    },
  };
}

/**
 * Register the `<otc-tag-cloud>` custom element (light DOM, built on `mount`).
 *
 * Items are passed either as a JSON `items` attribute (no-JS-framework usage)
 * or by assigning the `items` property (arrays don't survive attributes).
 * Options map to `min-px`, `max-px`, and `fill` attributes. Give the element a
 * height (it defaults itself to `display: block`); it fills it.
 *
 * The UMD/script-tag build calls this automatically; ESM consumers opt in:
 *
 *   import { defineElement } from '@opentagcloud/core';
 *   defineElement(); // <otc-tag-cloud> is now available
 */
export function defineElement(tagName?: string): void {
  const name = tagName || 'otc-tag-cloud';
  if (typeof customElements === 'undefined' || customElements.get(name)) return;

  class OtcTagCloudElement extends HTMLElement {
    static get observedAttributes(): string[] {
      return ['items', 'min-px', 'max-px', 'fill'];
    }

    private _handle: CloudHandle | null = null;
    /** Set via the `items` property; wins over the attribute. */
    private _items: TagCloudItem[] | null = null;

    get items(): TagCloudItem[] {
      if (this._items) return this._items;
      const raw = this.getAttribute('items');
      if (!raw) return [];
      try {
        return JSON.parse(raw);
      } catch {
        console.warn(`openTagCloud: invalid JSON in <${name}> items attribute`);
        return [];
      }
    }

    set items(value: TagCloudItem[]) {
      this._items = value || [];
      if (this._handle) this._handle.update(this._items);
    }

    connectedCallback(): void {
      if (!this.style.display) this.style.display = 'block';
      this._mount();
    }

    disconnectedCallback(): void {
      if (this._handle) {
        this._handle.destroy();
        this._handle = null;
      }
    }

    attributeChangedCallback(attr: string): void {
      if (!this.isConnected || !this._handle) return;
      if (attr === 'items') {
        // the property, once set, owns the data
        if (!this._items) this._handle.update(this.items);
      } else {
        // min-px / max-px / fill are fixed at mount time — remount
        this._handle.destroy();
        this._handle = null;
        this._mount();
      }
    }

    private _mount(): void {
      if (this._handle) return;
      const num = (attr: string) => {
        const v = parseFloat(this.getAttribute(attr) || '');
        return isFinite(v) ? v : undefined;
      };
      this._handle = mount(this, this.items, {
        minPx: num('min-px'),
        maxPx: num('max-px'),
        fill: (this.getAttribute('fill') || undefined) as Fill | undefined,
      });
    }
  }

  customElements.define(name, OtcTagCloudElement);
}
