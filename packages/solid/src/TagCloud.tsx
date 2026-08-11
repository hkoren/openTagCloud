import {
  createEffect,
  createMemo,
  on,
  onCleanup,
  onMount,
  For,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import {
  prepareTags,
  TagCloudLayout,
  type Fill,
  type PreparedTag,
  type PrepareOptions,
  type TagCloudItem,
} from '@opentagcloud/core';

export interface TagCloudProps {
  /** The tags to lay out. */
  items: TagCloudItem[];
  /** Font size (px) of the lightest tag. */
  minPx?: number;
  /** Font size (px) of the heaviest tag. */
  maxPx?: number;
  /**
   * `'height'`/`'both'` lets the cloud spread its terms to fill a taller
   * container (e.g. a grid-row sibling) so neighbours stay aligned.
   */
  fill?: Fill;
  /** Opacity of the lightest tag (raise for WCAG contrast; 1 disables the fade). */
  minOpacity?: number;
  /** Accessible name per tag: true → "<label>, weight <weight>", or a custom fn. */
  ariaLabel?: PrepareOptions['ariaLabel'];
  /** Keep unchanged tags in place across item updates (see TagCloudLayoutOptions). */
  incremental?: boolean;
  /** How tightly terms cluster, 0–1 (default 0.5): 0 spreads them evenly across the container, 1 packs them as tightly as possible around the centre. */
  density?: number;
  /** Fraction of a sized container to occupy, 0-1 (default 0.75). Lower values leave negative space; unrelated to `fill`. */
  fillFactor?: number;
  /**
   * Called when a tag is activated. Supplying it renders non-link tags as
   * `<button>`, so they are focusable and keyboard-operable.
   */
  onTagClick?: (item: TagCloudItem, event: MouseEvent) => void;
  /** Extra class(es) on the cloud container. */
  class?: string;
}

// Hyphenated words render inside .otc-nb (white-space: nowrap) so lines never
// break at a hyphen; the DOM text stays byte-identical to the label.
function tagContent(p: PreparedTag) {
  return (
    <For each={p.parts}>
      {(part) =>
        part.nowrap ? <span class="otc-nb">{part.text}</span> : part.text
      }
    </For>
  );
}

/**
 * SolidJS adapter: renders the tags (SSR-safe — the scatter is
 * deterministically seeded, so server and hydrated markup match) and hands
 * layout to `TagCloudLayout` on mount. Give the cloud a sized parent.
 *
 * Ships uncompiled Solid JSX under the `solid` export condition — compiled by
 * vite-plugin-solid (used by every Solid/SolidStart app) like your own code.
 */
export function TagCloud(props: TagCloudProps) {
  let root!: HTMLDivElement;
  let layout: TagCloudLayout | undefined;

  const prepared = createMemo(() =>
    prepareTags(props.items, {
      minPx: props.minPx ?? 12,
      maxPx: props.maxPx ?? 40,
      minOpacity: props.minOpacity ?? 0.62,
      ariaLabel: props.ariaLabel,
      interactive: !!props.onTagClick,
    }),
  );

  onMount(() => {
    layout = new TagCloudLayout(root, {
      fill: props.fill,
      incremental: props.incremental,
      density: props.density,
      fillFactor: props.fillFactor,
    });
    layout.attach();
    onCleanup(() => {
      layout?.destroy();
      layout = undefined;
    });
  });

  // Re-pack when the rendered tags change; attach() already packed the initial set.
  createEffect(on(prepared, () => layout?.refresh(), { defer: true }));
  createEffect(
    on(
      () => props.fill,
      (fill) => layout?.setFill(fill),
      { defer: true },
    ),
  );
  createEffect(
    on(
      () => props.density,
      (density) => layout?.setDensity(density),
      { defer: true },
    ),
  );
  createEffect(
    on(
      () => props.fillFactor,
      (fillFactor) => layout?.setFillFactor(fillFactor),
      { defer: true },
    ),
  );

  return (
    <div
      ref={root}
      class={props.class ? `otc-cloud ${props.class}` : 'otc-cloud'}
    >
      <For each={prepared()}>
        {(p) => (
          <Dynamic
            component={p.tag}
            class={p.className}
            href={p.href}
            type={p.tag === 'button' ? 'button' : undefined}
            title={p.title}
            aria-label={p.ariaLabel}
            style={p.style}
            data-fs={p.fontPx}
            data-weight={p.weight}
            data-key={p.key}
            onClick={(e: MouseEvent) => props.onTagClick?.(p.item, e)}
          >
            {tagContent(p)}
          </Dynamic>
        )}
      </For>
    </div>
  );
}
