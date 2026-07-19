// Convenience alias for Next.js apps. The React adapter already carries the
// 'use client' directive, so it drops straight into the App Router: it
// server-renders the justified no-JS fallback, then packs on hydration.
// Installing @opentagcloud/react directly works identically.
export { TagCloud } from '@opentagcloud/react';
export type { TagCloudProps } from '@opentagcloud/react';
export type { TagCloudItem, Fill } from '@opentagcloud/react';
