// Emit dist/styles.css from the TAG_CLOUD_CSS constant (single source of truth
// in src/styles.ts) so consumers can <link>/import the stylesheet for the
// no-JS/SSR fallback.
import { writeFileSync } from 'node:fs';
import { TAG_CLOUD_CSS } from '../dist/styles.js';

writeFileSync(new URL('../dist/styles.css', import.meta.url), TAG_CLOUD_CSS);
console.log('wrote dist/styles.css');
