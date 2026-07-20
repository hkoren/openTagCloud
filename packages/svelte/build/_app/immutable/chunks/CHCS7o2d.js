import { u as o, f as t, g as c, l as u } from './Dhq6kDMD.js';
function l(n) {
  throw new Error('https://svelte.dev/e/lifecycle_outside_component');
}
function i(n) {
  (t === null && l(),
    u && t.l !== null
      ? a(t).m.push(n)
      : o(() => {
          const e = c(n);
          if (typeof e == 'function') return e;
        }));
}
function a(n) {
  var e = n.l;
  return e.u ?? (e.u = { a: [], b: [], m: [] });
}
export { i as o };
