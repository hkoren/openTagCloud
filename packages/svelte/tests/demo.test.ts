import { describe, expect, it } from 'vitest';

/**
 * The demo used to be a SvelteKit route, which meant SvelteKit's dev server was
 * responsible for mounting it and nothing here had to. It is a plain Vite app
 * now, so src/demo/main.ts does the mounting — the one piece of that migration
 * with no other coverage, and the piece that breaks silently (a blank page)
 * rather than loudly.
 */
describe('demo entry', () => {
  it('mounts the demo into #app', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import('../src/demo/main.js');

    const app = document.getElementById('app')!;
    expect(app.querySelector('h1')?.textContent).toContain('openTagCloud');
    // The demo's whole point is showing a rendered cloud, so assert the tags
    // arrived rather than just that something mounted.
    expect(app.querySelectorAll('.otc-cloud .otc-tag').length).toBeGreaterThan(
      0,
    );
  });
});
