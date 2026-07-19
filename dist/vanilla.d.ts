import type { TagCloudItem } from "./types.js";

export interface MountOptions {
  /** Font size (px) of the lightest tag. Default 12. */
  minPx?: number;
  /** Font size (px) of the heaviest tag. Default 40. */
  maxPx?: number;
  /** Spread terms to fill a taller container. */
  fill?: "width" | "height" | "both";
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

/** Mount a tag cloud into a sized container. */
export function mount(
  container: HTMLElement,
  items: TagCloudItem[],
  options?: MountOptions,
): CloudHandle;

/**
 * Register the `<otc-tag-cloud>` custom element (light DOM, built on `mount`).
 * Items via the `items` property (array) or a JSON `items` attribute; options
 * via `min-px`, `max-px`, and `fill` attributes. The UMD/script-tag build
 * registers it automatically; ESM consumers call this once.
 */
export function defineElement(tagName?: string): void;

declare const _default: {
  mount: typeof mount;
  defineElement: typeof defineElement;
};
export default _default;
