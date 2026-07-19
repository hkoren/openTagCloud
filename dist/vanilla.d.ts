import type { TagCloudItem } from './types.js';

export interface MountOptions {
  /** Font size (px) of the lightest tag. Default 12. */
  minPx?: number;
  /** Font size (px) of the heaviest tag. Default 40. */
  maxPx?: number;
  /** Spread terms to fill a taller container. */
  fill?: 'width' | 'height' | 'both';
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

declare const _default: { mount: typeof mount };
export default _default;
