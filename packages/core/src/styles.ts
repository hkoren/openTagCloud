/**
 * The component stylesheet. Single source of truth — the build emits it as
 * `dist/styles.css` (for `<link>`/bundler import and SSR no-JS fallback), and
 * `injectStyles()` applies it at runtime for zero-config setups.
 */
export const TAG_CLOUD_CSS = `.otc-cloud {
  position: relative;
  display: block;
  flex: 1 1 auto;
  min-height: 0;
}
.otc-tag {
  display: inline-block;
  line-height: 0.95;
  text-align: center;
  font-weight: 700;
  /* Per-tag color (via --otc-tag-color) wins; then the --otc-color theme
     default; else inherit currentColor. */
  color: var(--otc-tag-color, var(--otc-color, currentColor));
  overflow-wrap: normal;
  word-break: normal;
  hyphens: none;
  text-decoration: none;
}
/* Hyphenated words are wrapped in .otc-nb so lines never break at a hyphen
   (the DOM text itself stays untouched — see prepareTags' label parts). */
.otc-tag .otc-nb {
  white-space: nowrap;
}
@media (prefers-reduced-motion: no-preference) {
  .otc-tag {
    transition:
      color var(--otc-transition, 150ms ease),
      opacity var(--otc-transition, 150ms ease),
      /* FLIP move/entrance animation on re-packs; set --otc-move-transition
         to 0s to disable */
        transform var(--otc-move-transition, 250ms cubic-bezier(0.22, 1, 0.36, 1));
  }
}
a.otc-tag:hover,
a.otc-tag:focus-visible {
  /* a per-tag color keeps its hue on hover; otherwise use the theme hover color */
  color: var(--otc-tag-color, var(--otc-hover-color, #2563eb));
  opacity: 1 !important;
  text-decoration: none;
}
/* Fallback before JS packs (and no-JS/SSR): justified inline flow. */
.otc-cloud:not(.otc-packed) {
  text-align: justify;
  text-align-last: justify;
  line-height: 1.15;
}
.otc-cloud:not(.otc-packed) .otc-tag {
  margin: 0.18em 0.3em;
  max-width: min(6.5em, 100%);
  vertical-align: middle;
}
`;

const STYLE_ID = 'opentagcloud-css';

/**
 * Idempotently add the component stylesheet to the document. Called by
 * `TagCloudLayout.attach()` by default, so no build-time CSS setup is needed.
 * For a styled no-JS/SSR fallback, also serve `@opentagcloud/core/styles.css`
 * with the page (the runtime injection is a no-op when it's already present —
 * duplicate rules are identical and harmless).
 */
export function injectStyles(doc?: Document): void {
  const d = doc ?? (typeof document === 'undefined' ? undefined : document);
  if (!d || d.getElementById(STYLE_ID)) return;
  const style = d.createElement('style');
  style.id = STYLE_ID;
  style.textContent = TAG_CLOUD_CSS;
  d.head.appendChild(style);
}
