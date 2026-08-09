// Parse-check every emitted .js file in a build output directory.
//
// Guards against a class of silent breakage: the stylesheet lives in a JS
// template literal (src/styles.ts), so a stray backtick in a CSS comment can
// terminate the string early and emit invalid JavaScript. Type-checking did not
// catch that, and the failure only surfaced as a blank page in the browser.
//
//   node ../../scripts/check-emit.mjs dist
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2] ?? 'dist';

function walk(d) {
  return readdirSync(d).flatMap((name) => {
    const full = join(d, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(dir).filter((f) => f.endsWith('.js') || f.endsWith('.mjs'));
for (const file of files) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    console.error(`check-emit: ${file} is not parseable JavaScript\n`);
    console.error(err.stderr?.toString() ?? err.message);
    process.exit(1);
  }
}
console.log(`check-emit: ${files.length} emitted file(s) parse cleanly`);
