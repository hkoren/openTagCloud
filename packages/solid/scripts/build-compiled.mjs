// Compile the preserved-JSX output (dist/source, used via the `solid` export
// condition by vite-plugin-solid) into plain DOM-mode JavaScript (dist/) with
// babel-preset-solid, so environments that don't compile node_modules —
// Jest/Vitest in node, webpack/Rspack, plain bundlers — get a working build
// instead of raw JSX (#9).
import { transformFileAsync } from '@babel/core';
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgRoot = fileURLToPath(new URL('..', import.meta.url));
const srcDir = join(pkgRoot, 'dist', 'source');
const outDir = join(pkgRoot, 'dist');
mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(srcDir)) {
  if (!/\.(jsx|js)$/.test(file)) continue;
  const result = await transformFileAsync(join(srcDir, file), {
    presets: [['babel-preset-solid', { generate: 'dom' }]],
    babelrc: false,
    configFile: false,
  });
  const code = result.code
    // compiled files live side by side as .js
    .replace(/(\.\/[\w.-]+)\.jsx(['"])/g, '$1.js$2');
  writeFileSync(join(outDir, file.replace(/\.jsx$/, '.js')), code);
}
console.log('wrote compiled DOM build to dist/ (source JSX in dist/source/)');
