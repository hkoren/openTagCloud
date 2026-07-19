import type { Fill, TagCloudItem } from './types.js';
import {
  prepareTags,
  type PreparedTag,
  type PrepareOptions,
} from './prepare.js';
import { TagCloudLayout } from './layout.js';

export interface RenderOptions extends PrepareOptions {
  /** Also spread terms vertically to fill the container's height. */
  fill?: Fill;
  /** Add the component stylesheet to the document (default true). */
  injectStyles?: boolean;
}

/** Handle returned by `renderTagCloud()`. */
export interface TagCloudHandle {
  /** Replace the items and re-pack. */
  update(items: TagCloudItem[]): void;
  /** Force a re-pack (e.g. after external style changes). */
  repack(): void;
  /** Change the fill mode. */
  setFill(fill: Fill | undefined): void;
  /** Stop observing and remove the rendered tags. */
  destroy(): void;
}

/**
 * Build the DOM element for one prepared tag — an `<a>` when the item has an
 * `href`, else a `<span>` — carrying the classes, inline style, and `data-*`
 * attributes `TagCloudLayout` reads. Exposed for custom vanilla renderers.
 */
export function createTagElement(
  p: PreparedTag,
  doc: Document = document,
): HTMLElement {
  const el = doc.createElement(p.item.href ? 'a' : 'span');
  el.className = p.className;
  if (p.item.href) (el as HTMLAnchorElement).href = p.item.href;
  el.setAttribute('style', p.style);
  el.title = p.title;
  if (p.ariaLabel) el.setAttribute('aria-label', p.ariaLabel);
  el.dataset.fs = String(p.fontPx);
  el.dataset.weight = String(p.weight);
  el.dataset.key = p.key;
  // Hyphenated words go inside .otc-nb (white-space: nowrap) so lines never
  // break at a hyphen; the DOM text stays byte-identical to the label.
  for (const part of p.parts) {
    if (part.nowrap) {
      const nb = doc.createElement('span');
      nb.className = 'otc-nb';
      nb.textContent = part.text;
      el.appendChild(nb);
    } else {
      el.appendChild(doc.createTextNode(part.text));
    }
  }
  return el;
}

/**
 * Vanilla-JS entry point: render a tag cloud into `container` (which should
 * have a sized parent, like any other usage) and keep it packed. No framework,
 * no build-time CSS setup required.
 *
 * ```js
 * import { renderTagCloud } from '@opentagcloud/core';
 * const cloud = renderTagCloud(document.querySelector('#cloud'), items);
 * // later: cloud.update(newItems); cloud.destroy();
 * ```
 */
export function renderTagCloud(
  container: HTMLElement,
  items: TagCloudItem[],
  options: RenderOptions = {},
): TagCloudHandle {
  container.classList.add('otc-cloud');
  const doc = container.ownerDocument;
  const render = (list: TagCloudItem[]) => {
    container.replaceChildren(
      ...prepareTags(list, options).map((p) => createTagElement(p, doc)),
    );
  };
  render(items);
  const layout = new TagCloudLayout(container, options);
  layout.attach();
  return {
    update(next) {
      render(next);
      layout.refresh();
    },
    repack() {
      layout.refresh();
    },
    setFill(fill) {
      layout.setFill(fill);
    },
    destroy() {
      layout.destroy();
      container.replaceChildren();
      container.classList.remove('otc-cloud', 'otc-packed');
    },
  };
}
