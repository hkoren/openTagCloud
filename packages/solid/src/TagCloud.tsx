import {
  createEffect,
  createMemo,
  on,
  onCleanup,
  onMount,
  For,
} from 'solid-js';
import {
  prepareTags,
  TagCloudLayout,
  type Fill,
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
  /** Extra class(es) on the cloud container. */
  class?: string;
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
    }),
  );

  onMount(() => {
    layout = new TagCloudLayout(root, { fill: props.fill });
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

  return (
    <div
      ref={root}
      class={props.class ? `otc-cloud ${props.class}` : 'otc-cloud'}
    >
      <For each={prepared()}>
        {(p) =>
          p.item.href ? (
            <a
              class={p.className}
              href={p.item.href}
              title={p.title}
              style={p.style}
              data-fs={p.fontPx}
              data-weight={p.weight}
              data-key={p.key}
            >
              {p.text}
            </a>
          ) : (
            <span
              class={p.className}
              title={p.title}
              style={p.style}
              data-fs={p.fontPx}
              data-weight={p.weight}
              data-key={p.key}
            >
              {p.text}
            </span>
          )
        }
      </For>
    </div>
  );
}
