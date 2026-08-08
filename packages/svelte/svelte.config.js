import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Read by svelte-package, svelte-check and vite-plugin-svelte. No `kit` section:
// SvelteKit was only ever used for the local demo page, and the demo is a plain
// Vite app now (see vite.config.ts).
/** @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig} */
const config = {
  preprocess: vitePreprocess(),
};

export default config;
