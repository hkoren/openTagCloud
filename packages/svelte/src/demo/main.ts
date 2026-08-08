// Entry point for the local demo (`npm run dev`, `npm run build:demo`). The
// published package is built from src/lib by svelte-package and does not include
// this. Plain Vite rather than SvelteKit: the demo is one page with no routing,
// no server, and no prerendering beyond a static index.html.
import { mount } from 'svelte';
import Demo from './Demo.svelte';

const target = document.getElementById('app');
if (!target) throw new Error('#app is missing from index.html');

export default mount(Demo, { target });
