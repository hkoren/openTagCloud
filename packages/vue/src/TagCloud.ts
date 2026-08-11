import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type PropType,
} from 'vue';
import {
  prepareTags,
  TagCloudLayout,
  type Fill,
  type PreparedTag,
  type PrepareOptions,
  type TagCloudItem,
} from '@opentagcloud/core';

// Hyphenated words render inside .otc-nb (white-space: nowrap) so lines never
// break at a hyphen; the DOM text stays byte-identical to the label.
const tagContent = (p: PreparedTag) =>
  p.parts.map((part) =>
    part.nowrap ? h('span', { class: 'otc-nb' }, part.text) : part.text,
  );

/**
 * Vue 3 adapter: renders the tags (SSR-safe — the scatter is deterministically
 * seeded, so server and client markup match) and hands layout to
 * `TagCloudLayout` on mount. Give the cloud a sized parent; it fills it.
 *
 * A render-function component rather than an SFC, so the package builds with
 * plain `tsc` and needs no Vue compiler at install time.
 */
export const TagCloud = defineComponent({
  name: 'TagCloud',
  props: {
    /** The tags to lay out. */
    items: { type: Array as PropType<TagCloudItem[]>, required: true },
    /** Font size (px) of the lightest tag. */
    minPx: { type: Number, default: 12 },
    /** Font size (px) of the heaviest tag. */
    maxPx: { type: Number, default: 40 },
    /** `'height'`/`'both'` also spreads terms to fill the container's height. */
    fill: { type: String as PropType<Fill>, default: undefined },
    /** Opacity of the lightest tag (raise for WCAG contrast; 1 disables the fade). */
    minOpacity: { type: Number, default: 0.62 },
    /** Accessible name per tag: true → "<label>, weight <weight>", or a custom fn. */
    ariaLabel: {
      type: [Boolean, Function] as PropType<PrepareOptions['ariaLabel']>,
      default: undefined,
    },
    /** Keep unchanged tags in place across item updates (see TagCloudLayoutOptions). */
    incremental: { type: Boolean, default: false },
    /** How tightly terms cluster, 0–1 (default 0.5): 0 spreads them evenly across the container, 1 packs them as tightly as possible around the centre. */
    density: { type: Number, default: undefined },
    /** Fraction of a sized container to occupy, 0-1 (default 0.75). Lower values leave negative space; unrelated to `fill`. */
    fillFactor: { type: Number, default: undefined },
    /** Called when a tag is activated; renders non-link tags as buttons. */
    onTagClick: {
      type: Function as PropType<
        (item: TagCloudItem, event: MouseEvent) => void
      >,
      default: undefined,
    },
  },
  setup(props) {
    const root = ref<HTMLElement>();
    let layout: TagCloudLayout | undefined;

    const prepared = computed(() =>
      prepareTags(props.items, {
        minPx: props.minPx,
        maxPx: props.maxPx,
        minOpacity: props.minOpacity,
        ariaLabel: props.ariaLabel,
        interactive: !!props.onTagClick,
      }),
    );

    onMounted(() => {
      layout = new TagCloudLayout(root.value!, {
        fill: props.fill,
        incremental: props.incremental,
        density: props.density,
        fillFactor: props.fillFactor,
      });
      layout.attach();
    });
    onBeforeUnmount(() => {
      layout?.destroy();
      layout = undefined;
    });

    watch(
      () => props.fill,
      (fill) => layout?.setFill(fill),
    );
    watch(
      () => props.density,
      (density) => layout?.setDensity(density),
    );
    watch(
      () => props.fillFactor,
      (fillFactor) => layout?.setFillFactor(fillFactor),
    );
    // Re-pack after the DOM reflects the new tags.
    watch(prepared, async () => {
      await nextTick();
      layout?.refresh();
    });

    return () =>
      h(
        'div',
        { class: 'otc-cloud', ref: root },
        prepared.value.map((p) =>
          h(
            p.tag,
            {
              key: p.key,
              class: p.className,
              href: p.href,
              type: p.tag === 'button' ? 'button' : undefined,
              onClick: props.onTagClick
                ? (e: MouseEvent) => props.onTagClick!(p.item, e)
                : undefined,
              title: p.title,
              'aria-label': p.ariaLabel,
              style: p.style,
              'data-fs': p.fontPx,
              'data-weight': p.weight,
              'data-key': p.key,
            },
            tagContent(p),
          ),
        ),
      );
  },
});
