/**
 * `opentagcloud/vanilla` — script-tag / no-build entry point, kept for
 * compatibility with the original vanilla build. The implementation lives in
 * @opentagcloud/core; this subpath simply re-exports it.
 */
export { mount, defineElement } from '@opentagcloud/core';
export type {
  MountOptions,
  CloudHandle,
  TagCloudItem,
  Fill,
} from '@opentagcloud/core';
