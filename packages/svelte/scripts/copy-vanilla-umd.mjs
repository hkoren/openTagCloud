// Copy the script-tag (UMD/global) build from @opentagcloud/core into this
// package's dist so `opentagcloud`'s unpkg/jsdelivr fields and the
// ./dist/opentagcloud.vanilla.js subpath keep working. Runs after
// svelte-package (which wipes dist/) in the build script.
import { copyFileSync } from 'node:fs';

copyFileSync(
  new URL('../../core/dist/opentagcloud.vanilla.js', import.meta.url),
  new URL('../dist/opentagcloud.vanilla.js', import.meta.url),
);
console.log('copied dist/opentagcloud.vanilla.js from @opentagcloud/core');
