import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // Only used by the demo app under src/routes; the published package is built
    // from src/lib by `svelte-package`. adapter-static prerenders the demo so
    // it can be hosted on GitHub Pages (BASE_PATH set by scripts/build-site.mjs).
    adapter: adapter({ fallback: undefined }),
    prerender: {
      // the demo's tag hrefs (#js, #rust, …) are decorative anchors
      handleMissingId: 'warn',
    },
    paths: {
      base: process.env.BASE_PATH || '',
    },
  },
};

export default config;
