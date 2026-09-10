import { execSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist-pages');

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'assets'), { recursive: true });
// The landing page carries a version badge. The checked-in HTML holds a real
// version so the file still works opened straight from disk, but the deployed
// copy is stamped from the core package that was just built — the page can then
// never claim a version other than the bundle it actually ships.
//
// Each substitution is asserted rather than assumed. Checking the *result* for
// the version string is not enough: the checked-in literal usually already
// matches, so a regex that silently stopped matching would still pass and the
// badge would quietly freeze at whatever was last hand-edited.
const version = JSON.parse(
  await readFile(path.join(root, 'packages', 'core', 'package.json'), 'utf8'),
).version;
const stamps = [
  {
    what: 'release link',
    pattern: /(<a\s[^>]*data-otc-version-link[^>]*href=")[^"]*(")/,
    to: `$1https://github.com/hkoren/openTagCloud/releases/tag/v${version}$2`,
  },
  {
    what: 'badge text',
    pattern: /(<a\s[^>]*data-otc-version-link[^>]*>)v[^<]*(<\/a\s*>)/,
    to: `$1v${version}$2`,
  },
];
let landing = await readFile(path.join(root, 'pages', 'index.html'), 'utf8');
for (const { what, pattern, to } of stamps) {
  if (!pattern.test(landing)) {
    throw new Error(
      `build-pages: no ${what} to stamp with version ${version} — the ` +
        'data-otc-version-link anchor in pages/index.html has changed shape.',
    );
  }
  landing = landing.replace(pattern, to);
}
await writeFile(path.join(output, 'index.html'), landing);
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
