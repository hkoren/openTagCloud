'use client';
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
} from 'react';
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
  /** Opacity of the lightest tag (raise for WCAG contrast; 1 disables the fade). */
  minOpacity?: number;
  /** Accessible name per tag: true → "<label>, weight <weight>", or a custom fn. */
  ariaLabel?: PrepareOptions['ariaLabel'];
  /**
   * `'height'`/`'both'` lets the cloud spread its terms to fill a taller
   * container (e.g. a grid-row sibling) so neighbours stay aligned.
   */
  fill?: Fill;
  /** Keep unchanged tags in place across item updates (see TagCloudLayoutOptions). */
  incremental?: boolean;
  /** How tightly terms cluster, 0–1 (default 0.5): 0 spreads them evenly across the container, 1 packs them as tightly as possible around the centre. */
  density?: number;
  /**
   * Called when a tag is activated. Supplying it renders non-link tags as
   * `<button>`, so they are focusable and keyboard-operable.
   */
  onTagClick?: (item: TagCloudItem, event: React.MouseEvent) => void;
  /** Extra class(es) on the cloud container. */
  className?: string;
}

function tagStyle(p: PreparedTag): CSSProperties {
  const style: CSSProperties = {
    fontSize: `${p.fontPx}px`,
    opacity: p.opacity,
  };
  if (p.item.color)
    (style as Record<string, unknown>)['--otc-tag-color'] = p.item.color;
  return style;
}

// Hyphenated words render inside .otc-nb (white-space: nowrap) so lines never
// break at a hyphen; the DOM text stays byte-identical to the label.
function tagContent(p: PreparedTag) {
  return p.parts.map((part, i) =>
    part.nowrap ? (
      <span key={i} className="otc-nb">
        {part.text}
      </span>
    ) : (
      <Fragment key={i}>{part.text}</Fragment>
    ),
  );
}

/**
 * Renders the tags server-side (deterministic scatter seeds keep SSR and
 * hydration in sync) and hands layout to `TagCloudLayout` on mount. Give the
 * cloud a sized parent; it fills it.
 */
export function TagCloud({
  items,
  minPx = 12,
  maxPx = 40,
  minOpacity = 0.62,
  ariaLabel,
  fill,
  incremental = false,
  density,
  onTagClick,
  className,
}: TagCloudProps) {
  const root = useRef<HTMLDivElement>(null);
  const layout = useRef<TagCloudLayout | null>(null);
  const prepared = useMemo(
    () =>
      prepareTags(items, {
        minPx,
        maxPx,
        minOpacity,
        ariaLabel,
        interactive: !!onTagClick,
      }),
    [items, minPx, maxPx, minOpacity, ariaLabel, onTagClick],
  );

  useEffect(() => {
    const l = new TagCloudLayout(root.current!, { fill, incremental, density });
    layout.current = l;
    l.attach();
    return () => {
      l.destroy();
      layout.current = null;
    };
    // fill changes are handled below without a re-attach
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    layout.current?.setFill(fill);
  }, [fill]);

  useEffect(() => {
    layout.current?.setDensity(density);
  }, [density]);

  // Re-pack when the rendered tags change; attach() already packed the initial set.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    layout.current?.refresh();
  }, [prepared]);

  return (
    <div
      ref={root}
      className={className ? `otc-cloud ${className}` : 'otc-cloud'}
    >
      {prepared.map((p) => {
        const El = p.tag;
        return (
          <El
            key={p.key}
            className={p.className}
            {...(p.href ? { href: p.href } : {})}
            {...(p.tag === 'button' ? { type: 'button' as const } : {})}
            title={p.title}
            aria-label={p.ariaLabel}
            style={tagStyle(p)}
            data-fs={p.fontPx}
            data-weight={p.weight}
            data-key={p.key}
            onClick={onTagClick ? (e) => onTagClick(p.item, e) : undefined}
          >
            {tagContent(p)}
          </El>
        );
      })}
    </div>
  );
}
