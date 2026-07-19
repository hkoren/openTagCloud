// Entry point for the script-tag build (dist/opentagcloud.vanilla.js),
// bundled by esbuild into an IIFE exposing `window.openTagCloud`.
export * from './index.js';
import { defineElement } from './vanilla.js';

// Script-tag convenience: register <otc-tag-cloud> automatically.
if (typeof customElements !== 'undefined') defineElement();
