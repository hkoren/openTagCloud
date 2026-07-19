import type { TagCloudItem } from './types.js';
type $$ComponentProps = {
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
    fill?: 'width' | 'height' | 'both';
};
declare const TagCloud: import("svelte").Component<$$ComponentProps, {}, "">;
type TagCloud = ReturnType<typeof TagCloud>;
export default TagCloud;
