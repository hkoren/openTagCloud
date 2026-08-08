import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// The local demo only. The PUBLISHED package is built separately by
// svelte-package into dist/, which is what `files` and `exports` point at — so
// the demo must not build there. SvelteKit's adapter-static used build/; keeping
// that output path means .gitignore and any local habits still hold.
//
// `base` mirrors what SvelteKit's paths.base did, so a demo built for a
// subdirectory still resolves its assets.
export default defineConfig({
  plugins: [svelte()],
  base: process.env.BASE_PATH || '/',
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
});
