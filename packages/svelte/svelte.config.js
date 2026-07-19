import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // Only used by the demo app under src/routes; the published package is built
    // from src/lib by `svelte-package`.
    adapter: adapter(),
  },
};

export default config;
