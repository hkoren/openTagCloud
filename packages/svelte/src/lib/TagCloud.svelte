<script lang="ts">
  import { onMount } from 'svelte';
  import {
    prepareTags,
    TagCloudLayout,
    type Fill,
    type TagCloudItem,
    type PrepareOptions,
  } from '@opentagcloud/core';
  import '@opentagcloud/core/styles.css';

  let {
    items,
    minPx = 12,
    maxPx = 40,
    minOpacity = 0.62,
    ariaLabel,
    fill,
    incremental = false,
  }: {
    /** The tags to lay out. */
    items: TagCloudItem[];
    /** Font size (px) of the lightest tag. */
    minPx?: number;
    /** Font size (px) of the heaviest tag. */
    maxPx?: number;
    /**
     * `'height'`/`'both'` lets the cloud spread its terms to fill a taller
     * container (e.g. a grid-row sibling) so neighbours stay aligned. Loop-safe:
     * only term positions change, never the container height.
     */
    fill?: Fill;
    /** Opacity of the lightest tag (raise for WCAG contrast; 1 disables the fade). */
    minOpacity?: number;
    /** Accessible name per tag: true → "<label>, weight <weight>", or a custom fn. */
    ariaLabel?: PrepareOptions['ariaLabel'];
    /** Keep unchanged tags in place across item updates (see TagCloudLayoutOptions). */
    incremental?: boolean;
  } = $props();

  const prepared = $derived(
    prepareTags(items, { minPx, maxPx, minOpacity, ariaLabel }),
  );

  let root: HTMLElement;
  let layout: TagCloudLayout | undefined;

  onMount(() => {
    layout = new TagCloudLayout(root, { fill, incremental });
    layout.attach();
    return () => layout?.destroy();
  });

  // Re-pack when the rendered tags change; attach() already packed the initial set.
  let firstRun = true;
  $effect(() => {
    void prepared;
    if (firstRun) {
      firstRun = false;
      return;
    }
    layout?.refresh();
  });
  $effect(() => {
    layout?.setFill(fill);
  });
</script>

<div class="otc-cloud" bind:this={root}>
  {#each prepared as p (p.key)}
    {#if p.item.href}
      <a
        class={p.className}
        href={p.item.href}
        title={p.title}
        aria-label={p.ariaLabel}
        style={p.style}
        data-fs={p.fontPx}
        data-weight={p.weight}
        data-key={p.key}
        >{#each p.parts as part}{#if part.nowrap}<span class="otc-nb"
              >{part.text}</span
            >{:else}{part.text}{/if}{/each}</a
      >
    {:else}
      <span
        class={p.className}
        title={p.title}
        aria-label={p.ariaLabel}
        style={p.style}
        data-fs={p.fontPx}
        data-weight={p.weight}
        data-key={p.key}
        >{#each p.parts as part}{#if part.nowrap}<span class="otc-nb"
              >{part.text}</span
            >{:else}{part.text}{/if}{/each}</span
      >
    {/if}
  {/each}
</div>
