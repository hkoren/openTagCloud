/** A single tag in the cloud. */
export interface TagCloudItem {
  /** The text to display. Hyphens render as non-breaking hyphens. */
  label: string;
  /** Relative importance — drives font size. Any positive number. */
  weight: number;
  /** Optional link. When set the tag renders as an `<a>`, otherwise a `<span>`. */
  href?: string;
  /**
   * Stable identity used to seed the deterministic scatter and as the keyed-each
   * key. Defaults to `label`; set it when two tags can share a label, or when the
   * label changes but the tag is conceptually the same.
   */
  id?: string;
  /** Tooltip text. Defaults to the `weight`. */
  title?: string;
  /** Extra class(es) applied to the tag element, for custom per-tag styling. */
  class?: string;
}
