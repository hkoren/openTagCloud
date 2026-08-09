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
    onTagClick,
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
    /**
     * Called when a tag is activated. Supplying it renders non-link tags as
     * `<button>`, so they are focusable and keyboard-operable.
     */
    onTagClick?: (item: TagCloudItem, event: MouseEvent) => void;
  } = $props();

  const prepared = $derived(
    prepareTags(items, {
      minPx,
      maxPx,
      minOpacity,
      ariaLabel,
      interactive: !!onTagClick,
    }),
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
    <!-- The analyzer cannot see that `tag` is 'a' or 'button' whenever a click
         handler exists (prepareTags picks 'span' only when onTagClick is
         absent, in which case onclick is undefined), so the static-element
         warning is a false positive here. -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <svelte:element
      this={p.tag}
      class={p.className}
      href={p.href}
      type={p.tag === 'button' ? 'button' : undefined}
      title={p.title}
      aria-label={p.ariaLabel}
      style={p.style}
      data-fs={p.fontPx}
      data-weight={p.weight}
      data-key={p.key}
      onclick={onTagClick
        ? (e: MouseEvent) => onTagClick(p.item, e)
        : undefined}
      >{#each p.parts as part}{#if part.nowrap}<span class="otc-nb"
            >{part.text}</span
          >{:else}{part.text}{/if}{/each}</svelte:element
    >
  {/each}
</div>
