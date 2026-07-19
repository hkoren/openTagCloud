// Generate dist/opentagcloud.vanilla.js (UMD/global) from src/lib/vanilla.js.
// Runs as part of `npm run package`, after svelte-package regenerates dist/ —
// svelte-package wipes dist, so the UMD must be (re)built here, never hand-edited.
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync(
  new URL("../src/lib/vanilla.js", import.meta.url),
  "utf8",
);
const body = src
  .replace(/^export function /gm, "function ")
  .replace(/^export default[^\n]*\n?/m, "");

const banner = `/* openTagCloud vanilla (UMD/global) build — generated from src/lib/vanilla.js
   by scripts/build-vanilla-umd.mjs; do not edit directly. Load via
   <script src="opentagcloud.vanilla.js"></script> then call
   openTagCloud.mount(el, items, opts). The <otc-tag-cloud> custom element is
   registered automatically. Also works as CommonJS/AMD. */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
      ? define(factory)
      : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
        (global.openTagCloud = factory()));
})(this, function () {
  'use strict';

`;

const footer = `
  // Script-tag convenience: register the <otc-tag-cloud> custom element.
  if (typeof customElements !== 'undefined') defineElement();

  return {
    mount: mount,
    defineElement: defineElement,
    default: { mount: mount, defineElement: defineElement },
  };
});
`;

writeFileSync(
  new URL("../dist/opentagcloud.vanilla.js", import.meta.url),
  banner + body + footer,
);
console.log("wrote dist/opentagcloud.vanilla.js");
