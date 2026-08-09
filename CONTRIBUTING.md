# Contributing

Thanks for looking. This is an npm-workspaces monorepo: one layout engine in
`@opentagcloud/core`, six thin framework adapters, and a live examples site.

## Getting set up

```sh
npm install                        # from the repo root
npm run dev                        # the Svelte demo (packages/svelte)
```

## The commands CI runs

```sh
npm run lint        # prettier --check
npm run build       # all seven packages, core first
npm run check       # svelte-check
npm test            # unit tests: core + all five adapters
npm run test:e2e    # Playwright (needs: npx playwright install chromium)
```

`npm run build` must come before `npm test` on a fresh clone — some suites
import built output (the Solid compiled fallback, and the vanilla tests exercise
the emitted UMD).

## Where things belong

**Layout, sizing, sanitization, and anything shared goes in
`@opentagcloud/core`.** Adapters should stay thin: render the tags that
`prepareTags()` prepared, hand the container to `TagCloudLayout`, and forward
props. If a change needs touching all six renderers identically, it probably
belongs in core instead.

- `prepare.ts` — pure, DOM-free per-tag computation. Runs during SSR, so it must
  not touch `window`/`document`.
- `layout.ts` — the packer. Reads `.otc-tag` elements and their `data-fs` /
  `data-weight` / `data-key` attributes; agnostic to which framework rendered
  them.
- `styles.ts` — the stylesheet, as a JS template literal. **Avoid backticks in
  CSS comments** — they terminate the literal and emit invalid JavaScript.
  `scripts/check-emit.mjs` guards this during the build.

## Invariants worth knowing before you change layout

These are load-bearing and covered by tests that will fail loudly:

- **The scatter is deterministic.** `makeRng` is seeded per tag key, so
  server-rendered and hydrated output match. Golden values are pinned in
  `packages/core/tests/rng.test.ts` — changing them is a breaking change to
  every existing page's layout.
- **Layout must never feed back on its own height.** `pack()` derives its box
  height from content area, or from an _externally_ imposed height it probes for
  with its own `minHeight` zeroed. Reading a height the layout itself caused
  reintroduces relayout loops.
- **Width changes re-pack; height changes only re-distribute.** Re-packing on
  height is how loops start.
- **Buttons must measure exactly like spans**, or interactive clouds pack
  differently from display-only ones.

## Pull requests

- One concern per PR; explain _why_, not just what.
- Add or update tests — unit tests in `packages/*/tests`, browser behavior in
  `e2e/`.
- Run the five commands above; CI runs the same ones.
- Note user-visible changes in `CHANGELOG.md` under `Unreleased`.

## Releasing (maintainers)

Bump every package to the same version, merge, then push a tag:

```sh
git tag v0.4.3 && git push origin v0.4.3
```

`.github/workflows/release.yml` verifies and publishes all seven packages via
npm trusted publishing (OIDC) — no tokens involved. See the README's Releasing
section.
