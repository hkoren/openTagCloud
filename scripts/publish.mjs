#!/usr/bin/env node
// Publish every openTagCloud package to npm, in dependency order.
//
// Safe by default: without --yes this is a full rehearsal — the verify
// pipeline runs and every package is packed with `npm publish --dry-run`,
// but nothing reaches the registry.
//
//   node scripts/publish.mjs                  # dry-run rehearsal
//   node scripts/publish.mjs --yes            # publish for real
//   node scripts/publish.mjs --yes --skip-verify   # resume after a partial run
//   node scripts/publish.mjs --tag next       # publish under a dist-tag
//
// Already-published versions are detected and skipped, so a run that dies
// halfway can simply be re-run.
//
// First-time notes:
//   - `npm login` first; publishing the @opentagcloud/* packages requires the
//     "opentagcloud" org/scope to exist on your npm account
//     (https://www.npmjs.com/org/create).
//   - @opentagcloud/angular publishes its ng-packagr output (packages/angular/dist).

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const YES = args.includes('--yes');
const SKIP_VERIFY = args.includes('--skip-verify');
const tagIdx = args.indexOf('--tag');
const TAG = tagIdx >= 0 && args[tagIdx + 1] ? args[tagIdx + 1] : 'latest';

// Publish order matters: core first (every adapter depends on it), then the
// adapters, then @opentagcloud/next (depends on react). Angular publishes its
// ng-packagr output directory, whose generated package.json has no scripts.
const PACKAGES = [
  { name: '@opentagcloud/core', dir: 'packages/core' },
  { name: 'opentagcloud', dir: 'packages/svelte' },
  { name: '@opentagcloud/react', dir: 'packages/react' },
  { name: '@opentagcloud/vue', dir: 'packages/vue' },
  { name: '@opentagcloud/solid', dir: 'packages/solid' },
  { name: '@opentagcloud/next', dir: 'packages/next' },
  {
    name: '@opentagcloud/angular',
    dir: 'packages/angular',
    publishDir: 'packages/angular/dist',
    needsBuild: true,
  },
];

const log = (msg) => console.log(`\x1b[36m[publish]\x1b[0m ${msg}`);
const die = (msg) => {
  console.error(`\x1b[31m[publish] ERROR:\x1b[0m ${msg}`);
  process.exit(1);
};
const run = (cmd, cwd) => execSync(cmd, { stdio: 'inherit', cwd });
const tryCapture = (cmd) => {
  const r = spawnSync(cmd[0], cmd.slice(1), { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
};

const manifest = (dir) =>
  JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));

// ---------- preflight ----------

const version = manifest(PACKAGES[0].dir).version;
log(
  `publishing version ${version} with dist-tag "${TAG}"${YES ? '' : ' (DRY RUN — pass --yes to publish for real)'}`,
);

for (const p of PACKAGES) {
  const m = manifest(p.dir);
  if (m.name !== p.name) die(`${p.dir}: expected ${p.name}, found ${m.name}`);
  if (m.version !== version)
    die(`${p.name} is ${m.version}, expected ${version} — versions must match`);
  for (const [dep, range] of Object.entries(m.dependencies ?? {})) {
    if (dep.startsWith('@opentagcloud/') && range !== `^${version}`)
      die(`${p.name} depends on ${dep}@${range}; expected ^${version}`);
  }
}
log(`version check ok across ${PACKAGES.length} packages`);

const gitStatus = tryCapture(['git', 'status', '--porcelain']);
if (gitStatus === null) die('not a git repository?');
if (gitStatus !== '')
  (YES ? die : log)(
    'working tree is not clean — publish from a clean checkout of main',
  );
const branch = tryCapture(['git', 'branch', '--show-current']);
if (branch !== 'main')
  (YES ? die : log)(`on branch "${branch}" — publish from main`);

const whoami = tryCapture(['npm', 'whoami']);
if (whoami) log(`npm user: ${whoami}`);
else if (YES)
  die(
    'not logged in to npm — run `npm login` first (and create the "opentagcloud" org for the scoped packages)',
  );
else log('not logged in to npm (fine for a dry run)');

// ---------- verify ----------

if (SKIP_VERIFY) {
  log('--skip-verify: skipping lint/build/check/test pipeline');
} else {
  for (const cmd of [
    'npm run lint',
    'npm run build',
    'npm run check',
    'npm test',
    'npm run test:e2e',
  ]) {
    log(`verify: ${cmd}`);
    run(cmd);
  }
}

// ---------- publish ----------

const results = [];
for (const p of PACKAGES) {
  const already = tryCapture([
    'npm',
    'view',
    `${p.name}@${version}`,
    'version',
  ]);
  if (already) {
    log(`${p.name}@${version} already on the registry — skipping`);
    results.push([p.name, 'skipped (already published)']);
    continue;
  }
  const dir = p.publishDir ?? p.dir;
  if (p.needsBuild && !existsSync(join(dir, 'package.json'))) {
    log(`${p.name}: ${dir} missing — building`);
    run('npm run build', p.dir);
  }
  const scoped = p.name.startsWith('@');
  const cmd = [
    'npm publish',
    `--tag ${TAG}`,
    scoped ? '--access public' : '',
    YES ? '' : '--dry-run',
  ]
    .filter(Boolean)
    .join(' ');
  log(`${p.name}: ${cmd} (in ${dir})`);
  try {
    run(cmd, dir);
    results.push([p.name, YES ? 'published' : 'dry-run ok']);
  } catch {
    console.error(
      `\n[publish] ${p.name} failed. If this is a 403/404 on a scoped package, ` +
        'create the "opentagcloud" org at https://www.npmjs.com/org/create and re-run; ' +
        'already-published packages will be skipped automatically.',
    );
    process.exit(1);
  }
}

// ---------- summary ----------

console.log('\n── summary ──');
for (const [name, status] of results) console.log(`  ${name}: ${status}`);
if (YES) {
  console.log(
    `\nDone. Suggested follow-up:\n  git tag v${version} && git push origin v${version}`,
  );
} else {
  console.log('\nDry run complete — re-run with --yes to publish.');
}
