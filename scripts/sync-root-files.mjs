// Copy the monorepo's root CHANGELOG.md and LICENSE into a package so they
// ship on npm.
//
// npm cannot include files from outside a package directory. It auto-includes
// LICENSE (and README) when present in the package, but NOT CHANGELOG.md when
// a `files` array is set — verified with `npm pack --dry-run` — which is why
// each package also lists CHANGELOG.md in `files`.
//
//   node ../../scripts/sync-root-files.mjs        # into the package root (cwd)
//   node ../../scripts/sync-root-files.mjs dist   # into a build output dir
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILES = ['CHANGELOG.md', 'LICENSE'];

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const target = resolve(process.cwd(), process.argv[2] ?? '.');
mkdirSync(target, { recursive: true });

for (const name of FILES) {
  const source = join(root, name);
  if (!existsSync(source)) {
    console.error(`sync-root-files: ${source} not found`);
    process.exit(1);
  }
  copyFileSync(source, join(target, name));
}
console.log(`copied ${FILES.join(', ')} → ${target}`);
