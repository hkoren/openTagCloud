import { execSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
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

// The repo's standalone example pages, rewired to the assets copy of the UMD.
await mkdir(path.join(output, 'examples'), { recursive: true });
for (const name of ['vanilla.html', 'rtl.html']) {
  const html = await readFile(
    path.join(root, 'packages', 'core', 'examples', name),
    'utf8',
  );
  await writeFile(
    path.join(output, 'examples', name),
    html.replace(
      '../dist/opentagcloud.vanilla.js',
      '../assets/opentagcloud.vanilla.js',
    ),
  );
}

// The SvelteKit demo app, prerendered under /svelte/ (BASE_PATH keeps its
// asset URLs correct on the project page).
execSync('npm run build:demo -w opentagcloud', {
  stdio: 'inherit',
  cwd: root,
  env: { ...process.env, BASE_PATH: `${process.env.PAGES_BASE || ''}/svelte` },
});
await cp(
  path.join(root, 'packages', 'svelte', 'build'),
  path.join(output, 'svelte'),
  {
    recursive: true,
  },
);

console.log(`GitHub Pages site built at ${output}`);
