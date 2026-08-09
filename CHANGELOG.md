# Changelog

All notable changes to openTagCloud. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

All packages in the monorepo share a version and are released together.
Each entry links to its GitHub release, which carries the fuller narrative.

## Unreleased

### Security

- `item.href` is validated: only relative URLs and safe schemes (`http`,
  `https`, `mailto`, `tel`, `ftp`, `sms`) become links. `javascript:`, `data:`
  and friends — including whitespace/control-character obfuscations like
  `java\tscript:` — are dropped and the tag renders as text ([#36]).
- `item.color` is validated against the characters CSS colors legitimately
  need, so a value like `red;background-image:url(//evil.test/p.png)` can no
  longer append its own declaration to the inline style ([#35]).

### Added

- `onTagClick` on every adapter (`tagClick` output in Angular, and an option on
  `mount()`/`renderTagCloud()`): non-link tags render as
  `<button type="button">` so they are focusable and keyboard-operable, with no
  visual change. Links still fire it, so `preventDefault()` can take over
  navigation ([#39]).

### Added

- `SECURITY.md` (with private vulnerability reporting enabled) and
  `CONTRIBUTING.md`, plus a README Security section documenting which
  `TagCloudItem` fields are validated and which are trusted input ([#42]).

### Added

- `density` (0–1, default `0.5`) on every adapter, `mount()`/`renderTagCloud()`,
  and as a `density` attribute on `<otc-tag-cloud>`: `0` distributes terms
  evenly across the container, `1` packs them tightly around the centre leaving
  the corners empty. Terms never overlap at any setting. **This changes the
  default arrangement** — pass `density={0}` for the previous even spread
  ([#51]).

### Changed

- The cloud now takes its container's aspect ratio: each term's growth front is
  stretched to the box, so a wide container gets a wide elliptical cloud instead
  of a circular one floating in the middle. Measured on a 3.6:1 container, the
  cloud's aspect went from ~1.25 (nearly circular) to ~3.5.

- Tags no longer default their tooltip to the raw weight — a bare number like
  "95" is meaningless to a visitor. `item.title` still sets one, and
  `ariaLabel` provides the explained form ([#40]).

### Fixed

- `mount()` now exposes `setFill()`, matching `renderTagCloud()`, and
  `<otc-tag-cloud>` adjusts its `fill` attribute in place instead of
  remounting — which previously discarded the packed layout and the movement
  animation ([#41]).
- Tag keys are de-duplicated (`Java`, `Java#2`, …), fixing a hard
  `each_key_duplicate` crash in the Svelte adapter when two tags shared a label
  ([#37]).
- Published packages now contain the MIT `LICENSE` file, which every package
  declared but none shipped ([#38]).

## [0.4.2] — 2026-08-08

First release published entirely through npm
[trusted publishing](https://docs.npmjs.com/trusted-publishers), so every
artifact carries [SLSA provenance](https://slsa.dev/provenance/v1).

### Security

- Cleared all 24 Dependabot alerts (14 high, 8 medium, 2 low); `npm audit`
  reports 0 vulnerabilities at any severity. Every alert was reached through
  `package-lock.json` — none were in shipped code paths.
  - Transitive fixes: `next` 16.2.10 → 16.3.0 (9 alerts), `postcss` → 8.5.26
    (4), `sharp` 0.34.5 → 0.35.3, plus `js-yaml`, `fast-uri`, `nanoid` and
    `brace-expansion`.
  - Five Angular advisories were scoped `<= 19.2.25` with no patched version
    declared, so the Angular adapter's **devDependencies** moved to Angular
    20.3 (pulling TypeScript 5.8 and `jest-preset-angular` 14.6). The
    published `peerDependencies` still declares `@angular/core: >=17.0.0` —
    **consumers are unaffected**.
  - Removed `@sveltejs/kit`, which retired the final advisory (`cookie`
    < 0.7.0, with no upgrade path). Nothing imported it; it existed only to
    serve a one-page demo, now a plain Vite app.

### Added

- Unattended releases: pushing a `v*` tag runs the full verify pipeline and
  publishes all seven packages via OIDC, with no stored credential
  (`.github/workflows/release.yml`).

### Changed

- The release workflow runs Node 24, because trusted publishing requires
  npm ≥ 11.5.1 and Node 22 still bundles npm 10.9.x.
- README's Releasing section documents trusted publishing, token auth, and
  local publishing.

## [0.4.1] — 2026-08-08

### Fixed

- **Fit scaling no longer shrinks type below legible sizes.** 0.4.0's
  fit-to-container layout scaled the font ramp in both directions (down to
  ×0.5), cramming dense clouds in small containers at unreadable sizes. Fit
  scaling is now grow-only, clamped to ×1–×2.5: roomy containers still get
  maximized type, and a container too small for the tags at their base sizes
  overflows instead. `minPx`/`maxPx` are therefore a genuine floor.

### Added

- Per-package `npm install` instructions in the README, plus a CDN script-tag
  alternative, with each framework quick start leading with its install line.

### Changed

- The [examples site](https://hkoren.github.io/openTagCloud/) leads with the
  "One engine, every framework" cloud, whose tags link to each npm package.

## [0.4.0] — 2026-07-20

Restructured from a Svelte 5 component into a framework-agnostic monorepo.
The Svelte component keeps its package name (`opentagcloud`) and its API.

### Added

- **Seven packages** sharing one layout engine: `@opentagcloud/core` (zero
  dependencies) plus thin adapters `opentagcloud` (Svelte 5),
  `@opentagcloud/react`, `@opentagcloud/vue`, `@opentagcloud/angular`,
  `@opentagcloud/solid` and `@opentagcloud/next`. Each adapter renders tags in
  its own framework's templates, so SSR and hydration stay native.
- **No-build usage**: a browser global that registers the light-DOM
  `<otc-tag-cloud>` custom element, plus `mount()` / `defineElement()` via
  `opentagcloud/vanilla`.
- **Fit-to-container layout** — scales the font ramp to fill an externally
  sized container; auto-height containers keep area-based packing so layout
  cannot feed back on itself.
- **Movement animations** — FLIP transitions on re-pack via
  `--otc-move-transition`, honoring `prefers-reduced-motion`.
- **`incremental`** option: unchanged tags keep their positions across item
  updates.
- **RTL support** via `inset-inline-start` logical positioning.
- **`estimateCloudHeight()`** — pure, DOM-free height estimate for reserving
  `min-height` during SSR.
- **Accessibility**: `ariaLabel` (announces each tag's weight) and
  `minOpacity` (lets themes hold WCAG AA contrast).
- **Tests**: 61 unit tests and 18 Playwright end-to-end tests in CI, covering
  all five framework adapters, layout invariants, RTL and the UMD path.
- **[Live examples site](https://hkoren.github.io/openTagCloud/)**, deployed
  from `main`.

### Changed

- Collision detection uses a spatial hash and anchor ordering is incremental;
  a 400-tag re-pack runs in ~15 ms.
- Negative and non-finite weights are clamped instead of producing
  `font-size: NaNpx`.

### Fixed

- Labels are no longer rewritten: hyphenated words render inside
  `white-space: nowrap` spans, so copy/paste, find-in-page and screen readers
  see the real text.

### Breaking

- CSS classes are now `.otc-tag` / `.otc-cloud` (previously `.tag` / `.cloud`),
  since they must be global and unscoped.
- `dist/` is no longer committed, so `npm install github:hkoren/openTagCloud`
  is replaced by the npm packages.

## [0.3.0] — 2026-07-20

An interim publish of the monorepo, superseded the same day by 0.4.0. No git
tag or GitHub release exists for it; treat 0.4.0 as the first monorepo release.

## 0.2.0 and earlier

The original Svelte 5 component — self-packing layout, deterministic scatter,
CSS custom property theming, and per-tag `color`. Never published to npm;
installed directly from GitHub.

[0.4.2]: https://github.com/hkoren/openTagCloud/releases/tag/v0.4.2
[0.4.1]: https://github.com/hkoren/openTagCloud/releases/tag/v0.4.1
[0.4.0]: https://github.com/hkoren/openTagCloud/releases/tag/v0.4.0
[0.3.0]: https://www.npmjs.com/package/opentagcloud/v/0.3.0
[#35]: https://github.com/hkoren/openTagCloud/issues/35
[#36]: https://github.com/hkoren/openTagCloud/issues/36
[#37]: https://github.com/hkoren/openTagCloud/issues/37
[#38]: https://github.com/hkoren/openTagCloud/issues/38
[#39]: https://github.com/hkoren/openTagCloud/issues/39
[#40]: https://github.com/hkoren/openTagCloud/issues/40
[#41]: https://github.com/hkoren/openTagCloud/issues/41
[#42]: https://github.com/hkoren/openTagCloud/issues/42
[#51]: https://github.com/hkoren/openTagCloud/issues/51
