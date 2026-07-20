import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist-pages');

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'assets'), { recursive: true });
await cp(
  path.join(root, 'pages', 'index.html'),
  path.join(output, 'index.html'),
);
await cp(
  path.join(root, 'packages', 'core', 'dist', 'opentagcloud.vanilla.js'),
  path.join(output, 'assets', 'opentagcloud.vanilla.js'),
);
await cp(path.join(root, 'LICENSE'), path.join(output, 'LICENSE.txt'));

console.log(`GitHub Pages site built at ${output}`);
