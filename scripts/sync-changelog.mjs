// Copy the monorepo CHANGELOG.md into a package so it ships on npm.
//
// npm cannot include files from outside a package directory, and — unlike
// README.md — it does not auto-include CHANGELOG.md when a `files` array is
// present (verified with `npm pack --dry-run`). So each package's build copies
// it in, and lists it in `files`. The copies are gitignored.
//
//   node ../../scripts/sync-changelog.mjs        # into the package root (cwd)
//   node ../../scripts/sync-changelog.mjs dist   # into a build output dir
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = resolve(
  fileURLToPath(new URL('..', import.meta.url)),
  'CHANGELOG.md',
);
const target = resolve(process.cwd(), process.argv[2] ?? '.');

if (!existsSync(source)) {
  console.error(`sync-changelog: ${source} not found`);
  process.exit(1);
}
mkdirSync(target, { recursive: true });
copyFileSync(source, join(target, 'CHANGELOG.md'));
console.log(`copied CHANGELOG.md → ${join(target, 'CHANGELOG.md')}`);
