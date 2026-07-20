var Kt = (t) => {
  throw TypeError(t);
};
var St = (t, e, a) => e.has(t) || Kt('Cannot ' + a);
var v = (t, e, a) => (
    St(t, e, 'read from private field'),
    a ? a.call(t) : e.get(t)
  ),
  N = (t, e, a) =>
    e.has(t)
      ? Kt('Cannot add the same private member more than once')
      : e instanceof WeakSet
        ? e.add(t)
        : e.set(t, a),
  C = (t, e, a, s) => (
    St(t, e, 'write to private field'),
    s ? s.call(t, a) : e.set(t, a),
    a
  ),
  O = (t, e, a) => (St(t, e, 'access private method'), a);
import { a as B, f as mt, c as Et, t as qt } from '../chunks/CFiLYvC6.js';
import {
  c as Ct,
  i as xe,
  h as D,
  z as Tt,
  X as we,
  w as be,
  G as k,
  x as Me,
  a7 as _e,
  y as Yt,
  A as At,
  e as yt,
  ao as ke,
  aw as Se,
  ag as Gt,
  a as Ee,
  aF as J,
  b as Nt,
  aG as Ce,
  s as Te,
  U as Ae,
  aH as He,
  aI as Fe,
  aA as Le,
  a3 as jt,
  aJ as Pe,
  M as Re,
  r as he,
  p as fe,
  aK as Ht,
  aL as Ie,
  at as Ne,
  m as ze,
  d as Oe,
  av as Wt,
  aM as We,
  aq as Be,
  aN as Jt,
  aO as Vt,
  aP as De,
  aQ as Ue,
  aR as Ke,
  aS as qe,
  aT as Ye,
  aU as Ge,
  aV as je,
  k as Je,
  u as Xt,
  n as Ve,
  j as Ft,
  q as j,
  t as nt,
  aE as Xe,
  o as it,
  v as Lt,
} from '../chunks/Dhq6kDMD.js';
import { o as Qe } from '../chunks/CHCS7o2d.js';
import { s as xt } from '../chunks/Cz55Lnah.js';
import { p as wt, b as Ze, i as Pt } from '../chunks/F1HylrHd.js';
function Qt(t, e) {
  return e;
}
function $e(t, e, a) {
  for (var s = [], r = e.length, c, i = e.length, h = 0; h < r; h++) {
    let m = e[h];
    fe(
      m,
      () => {
        if (c) {
          if ((c.pending.delete(m), c.done.add(m), c.pending.size === 0)) {
            var p = t.outrogroups;
            (zt(t, Wt(c.done)),
              p.delete(c),
              p.size === 0 && (t.outrogroups = null));
          }
        } else i -= 1;
      },
      !1,
    );
  }
  if (i === 0) {
    var u = s.length === 0 && a !== null;
    if (u) {
      var o = a,
        g = o.parentNode;
      (Ne(g), g.append(o), t.items.clear());
    }
    zt(t, e, !u);
  } else
    ((c = { pending: new Set(e), done: new Set() }),
      (t.outrogroups ?? (t.outrogroups = new Set())).add(c));
}
function zt(t, e, a = !0) {
  var s;
  if (t.pending.size > 0) {
    s = new Set();
    for (const i of t.pending.values())
      for (const h of i) s.add(t.items.get(h).e);
  }
  for (var r = 0; r < e.length; r++) {
    var c = e[r];
    if (s != null && s.has(c)) {
      c.f |= J;
      const i = document.createDocumentFragment();
      ze(c, i);
    } else Oe(e[r], a);
  }
}
var Zt;
function Rt(t, e, a, s, r, c = null) {
  var i = t,
    h = new Map();
  {
    var u = t;
    i = D ? Tt(we(u)) : u.appendChild(Ct());
  }
  D && be();
  var o = null,
    g = Ae(() => {
      var n = a();
      return We(n) ? n : n == null ? [] : Wt(n);
    }),
    m,
    p = new Map(),
    x = !0;
  function f(n) {
    (l.effect.f & Re) === 0 &&
      (l.pending.delete(n),
      (l.fallback = o),
      ta(l, m, i, e, s),
      o !== null &&
        (m.length === 0
          ? (o.f & J) === 0
            ? he(o)
            : ((o.f ^= J), ft(o, null, i))
          : fe(o, () => {
              o = null;
            })));
  }
  function T(n) {
    l.pending.delete(n);
  }
  var H = xe(() => {
      m = k(g);
      var n = m.length;
      let S = !1;
      if (D) {
        var w = Me(i) === _e;
        w !== (n === 0) && ((i = Yt()), Tt(i), At(!1), (S = !0));
      }
      for (var A = new Set(), d = Ee, y = Te(), F = 0; F < n; F += 1) {
        D &&
          yt.nodeType === ke &&
          yt.data === Se &&
          ((i = yt), (S = !0), At(!1));
        var b = m[F],
          M = s(b, F),
          E = x ? null : h.get(M);
        (E
          ? (E.v && Gt(E.v, b), E.i && Gt(E.i, F), y && d.unskip_effect(E.e))
          : ((E = ea(h, x ? i : (Zt ?? (Zt = Ct())), b, M, F, r, e, a)),
            x || (E.e.f |= J),
            h.set(M, E)),
          A.add(M));
      }
      if (
        (n === 0 &&
          c &&
          !o &&
          (x
            ? (o = Nt(() => c(i)))
            : ((o = Nt(() => c(Zt ?? (Zt = Ct())))), (o.f |= J))),
        n > A.size && Ce(),
        D && n > 0 && Tt(Yt()),
        !x)
      )
        if ((p.set(d, A), y)) {
          for (const [et, vt] of h) A.has(et) || d.skip_effect(vt.e);
          (d.oncommit(f), d.ondiscard(T));
        } else f(d);
      (S && At(!0), k(g));
    }),
    l = { effect: H, items: h, pending: p, outrogroups: null, fallback: o };
  ((x = !1), D && (i = yt));
}
function ht(t) {
  for (; t !== null && (t.f & Ie) === 0;) t = t.next;
  return t;
}
function ta(t, e, a, s, r) {
  var F;
  var c = e.length,
    i = t.items,
    h = ht(t.effect.first),
    u,
    o = null,
    g = [],
    m = [],
    p,
    x,
    f,
    T;
  for (T = 0; T < c; T += 1) {
    if (((p = e[T]), (x = r(p, T)), (f = i.get(x).e), t.outrogroups !== null))
      for (const b of t.outrogroups) (b.pending.delete(f), b.done.delete(f));
    if (((f.f & Ht) !== 0 && he(f), (f.f & J) !== 0))
      if (((f.f ^= J), f === h)) ft(f, null, a);
      else {
        var H = o ? o.next : h;
        (f === t.effect.last && (t.effect.last = f.prev),
          f.prev && (f.prev.next = f.next),
          f.next && (f.next.prev = f.prev),
          V(t, o, f),
          V(t, f, H),
          ft(f, H, a),
          (o = f),
          (g = []),
          (m = []),
          (h = ht(o.next)));
        continue;
      }
    if (f !== h) {
      if (u !== void 0 && u.has(f)) {
        if (g.length < m.length) {
          var l = m[0],
            n;
          o = l.prev;
          var S = g[0],
            w = g[g.length - 1];
          for (n = 0; n < g.length; n += 1) ft(g[n], l, a);
          for (n = 0; n < m.length; n += 1) u.delete(m[n]);
          (V(t, S.prev, w.next),
            V(t, o, S),
            V(t, w, l),
            (h = l),
            (o = w),
            (T -= 1),
            (g = []),
            (m = []));
        } else
          (u.delete(f),
            ft(f, h, a),
            V(t, f.prev, f.next),
            V(t, f, o === null ? t.effect.first : o.next),
            V(t, o, f),
            (o = f));
        continue;
      }
      for (g = [], m = []; h !== null && h !== f;)
        ((u ?? (u = new Set())).add(h), m.push(h), (h = ht(h.next)));
      if (h === null) continue;
    }
    ((f.f & J) === 0 && g.push(f), (o = f), (h = ht(f.next)));
  }
  if (t.outrogroups !== null) {
    for (const b of t.outrogroups)
      b.pending.size === 0 &&
        (zt(t, Wt(b.done)), (F = t.outrogroups) == null || F.delete(b));
    t.outrogroups.size === 0 && (t.outrogroups = null);
  }
  if (h !== null || u !== void 0) {
    var A = [];
    if (u !== void 0) for (f of u) (f.f & Ht) === 0 && A.push(f);
    for (; h !== null;)
      ((h.f & Ht) === 0 && h !== t.fallback && A.push(h), (h = ht(h.next)));
    var d = A.length;
    if (d > 0) {
      var y = c === 0 ? a : null;
      $e(t, A, y);
    }
  }
}
function ea(t, e, a, s, r, c, i, h) {
  var u = (i & He) !== 0 ? ((i & Fe) === 0 ? Le(a, !1, !1) : jt(a)) : null,
    o = (i & Pe) !== 0 ? jt(r) : null;
  return {
    v: u,
    i: o,
    e: Nt(
      () => (
        c(e, u ?? a, o ?? r, h),
        () => {
          t.delete(s);
        }
      ),
    ),
  };
}
function ft(t, e, a) {
  if (t.nodes)
    for (
      var s = t.nodes.start,
        r = t.nodes.end,
        c = e && (e.f & J) === 0 ? e.nodes.start : a;
      s !== null;
    ) {
      var i = Be(s);
      if ((c.before(s), s === r)) return;
      s = i;
    }
}
function V(t, e, a) {
  (e === null ? (t.effect.first = a) : (e.next = a),
    a === null ? (t.effect.last = e) : (a.prev = e));
}
function ue(t) {
  var e,
    a,
    s = '';
  if (typeof t == 'string' || typeof t == 'number') s += t;
  else if (typeof t == 'object')
    if (Array.isArray(t)) {
      var r = t.length;
      for (e = 0; e < r; e++)
        t[e] && (a = ue(t[e])) && (s && (s += ' '), (s += a));
    } else for (a in t) t[a] && (s && (s += ' '), (s += a));
  return s;
}
function aa() {
  for (var t, e, a = 0, s = '', r = arguments.length; a < r; a++)
    (t = arguments[a]) && (e = ue(t)) && (s && (s += ' '), (s += e));
  return s;
}
function $t(t) {
  return typeof t == 'object' ? aa(t) : (t ?? '');
}
function sa(t, e, a) {
  var s = t == null ? '' : '' + t;
  return s === '' ? null : s;
}
function na(t, e) {
  return t == null ? null : String(t);
}
function te(t, e, a, s, r, c) {
  var i = t[Jt];
  if (D || i !== a || i === void 0) {
    var h = sa(a);
    ((!D || h !== t.getAttribute('class')) &&
      (h == null ? t.removeAttribute('class') : (t.className = h)),
      (t[Jt] = a));
  }
  return c;
}
function ee(t, e, a, s) {
  var r = t[Vt];
  if (D || r !== e) {
    var c = na(e);
    ((!D || c !== t.getAttribute('style')) &&
      (c == null ? t.removeAttribute('style') : (t.style.cssText = c)),
      (t[Vt] = e));
  }
  return s;
}
const ia = Symbol('is custom element'),
  oa = Symbol('is html'),
  ra = qe ? 'link' : 'LINK';
function W(t, e, a, s) {
  var r = la(t);
  (D &&
    ((r[e] = t.getAttribute(e)),
    e === 'src' || e === 'srcset' || (e === 'href' && t.nodeName === ra))) ||
    (r[e] !== (r[e] = a) &&
      (e === 'loading' && (t[De] = a),
      a == null
        ? t.removeAttribute(e)
        : typeof a != 'string' && ca(t).includes(e)
          ? (t[e] = a)
          : t.setAttribute(e, a)));
}
function la(t) {
  var e;
  return (
    t[(e = Ue)] ??
    (t[e] = { [ia]: t.nodeName.includes('-'), [oa]: t.namespaceURI === Ke })
  );
}
var ae = new Map();
function ca(t) {
  var e = t.getAttribute('is') || t.nodeName,
    a = ae.get(e);
  if (a) return a;
  ae.set(e, (a = []));
  for (var s, r = t, c = Element.prototype; c !== r;) {
    s = Ge(r);
    for (var i in s)
      s[i].set &&
        i !== 'innerHTML' &&
        i !== 'textContent' &&
        i !== 'innerText' &&
        a.push(i);
    r = Ye(r);
  }
  return a;
}
je();
const ha = (t) => t.id ?? t.label,
  fa = 1.9,
  ua = 9;
let se = !1;
function da(t) {
  return Number.isFinite(t) && t >= 0
    ? t
    : (se ||
        ((se = !0),
        console.warn(
          'opentagcloud: negative or non-finite tag weight(s) clamped to 0',
        )),
      0);
}
function pa(t) {
  const e = t.length,
    a = Math.max(...t.split(/\s+/).map((s) => s.length));
  return Math.max(
    0.45,
    Math.min(Math.min(1, 15 / Math.max(15, e)), 11 / Math.max(11, a)),
  );
}
function ga(t) {
  const e = [];
  for (const a of t.split(/(\s+)/)) {
    if (!a) continue;
    const s = !/\s/.test(a) && a.includes('-'),
      r = e[e.length - 1];
    !s && r && !r.nowrap ? (r.text += a) : e.push({ text: a, nowrap: s });
  }
  return e;
}
function ma(t, e = {}) {
  const {
      minPx: a = 12,
      maxPx: s = 40,
      minOpacity: r = 0.62,
      ariaLabel: c,
    } = e,
    i = t.map((o) => da(o.weight)),
    h = Math.max(1, ...i),
    u = Math.min(1.1, Math.max(0.5, Math.sqrt(18 / Math.max(1, t.length))));
  return t.map((o, g) => {
    const m = i[g],
      p = a + Math.pow(m / h, fa) * (s - a),
      x = +Math.max(ua, p * u * pa(o.label)).toFixed(1),
      f = +(r + Math.pow(m / h, 0.8) * (1 - r)).toFixed(2);
    return {
      item: o,
      key: ha(o),
      weight: m,
      text: o.label,
      parts: ga(o.label),
      fontPx: x,
      opacity: f,
      title: o.title ?? String(o.weight),
      ariaLabel: c
        ? typeof c == 'function'
          ? c(o)
          : `${o.label}, weight ${o.weight}`
        : void 0,
      className: o.class ? `otc-tag ${o.class}` : 'otc-tag',
      style: `font-size:${x}px;opacity:${f};${o.color ? `--otc-tag-color:${o.color};` : ''}`,
    };
  });
}
const va = `.otc-cloud {
  position: relative;
  display: block;
  flex: 1 1 auto;
  min-height: 0;
}
.otc-tag {
  display: inline-block;
  line-height: 0.95;
  text-align: center;
  font-weight: 700;
  /* Per-tag color (via --otc-tag-color) wins; then the --otc-color theme
     default; else inherit currentColor. */
  color: var(--otc-tag-color, var(--otc-color, currentColor));
  overflow-wrap: normal;
  word-break: normal;
  hyphens: none;
  text-decoration: none;
}
/* Hyphenated words are wrapped in .otc-nb so lines never break at a hyphen
   (the DOM text itself stays untouched — see prepareTags' label parts). */
.otc-tag .otc-nb {
  white-space: nowrap;
}
@media (prefers-reduced-motion: no-preference) {
  .otc-tag {
    transition:
      color var(--otc-transition, 150ms ease),
      opacity var(--otc-transition, 150ms ease),
      /* FLIP move/entrance animation on re-packs; set --otc-move-transition
         to 0s to disable */
        transform var(--otc-move-transition, 250ms cubic-bezier(0.22, 1, 0.36, 1));
  }
}
a.otc-tag:hover,
a.otc-tag:focus-visible {
  /* a per-tag color keeps its hue on hover; otherwise use the theme hover color */
  color: var(--otc-tag-color, var(--otc-hover-color, #2563eb));
  opacity: 1 !important;
  text-decoration: none;
}
/* Fallback before JS packs (and no-JS/SSR): justified inline flow. */
.otc-cloud:not(.otc-packed) {
  text-align: justify;
  text-align-last: justify;
  line-height: 1.15;
}
.otc-cloud:not(.otc-packed) .otc-tag {
  margin: 0.18em 0.3em;
  max-width: min(6.5em, 100%);
  vertical-align: middle;
}
`,
  ne = 'opentagcloud-css';
function ya(t) {
  const e = t ?? (typeof document > 'u' ? void 0 : document);
  if (!e || e.getElementById(ne)) return;
  const a = e.createElement('style');
  ((a.id = ne), (a.textContent = va), e.head.appendChild(a));
}
function ie(t) {
  let e = 1779033703 ^ t.length;
  for (let s = 0; s < t.length; s++)
    ((e = Math.imul(e ^ t.charCodeAt(s), 3432918353)),
      (e = (e << 13) | (e >>> 19)));
  let a = e >>> 0;
  return () => (
    (a = Math.imul(a ^ (a >>> 15), 1 | a) >>> 0),
    (a = (a + Math.imul(a ^ (a >>> 7), 61 | a)) >>> 0),
    ((a ^ (a >>> 14)) >>> 0) / 4294967296
  );
}
const z = 5,
  oe = 1.4,
  re = (t) => Math.min(1.25, Math.max(0.72, t / 460));
function le() {
  const e = new Map(),
    a = (r, c) => c * 8192 + r,
    s = (r, c, i, h) => [
      Math.max(0, Math.floor((r - z) / 64)),
      Math.max(0, Math.floor((r + i + z) / 64)),
      Math.max(0, Math.floor((c - z) / 64)),
      Math.max(0, Math.floor((c + h + z) / 64)),
    ];
  return {
    insert(r) {
      const [c, i, h, u] = s(r.x, r.y, r.w, r.h);
      for (let o = h; o <= u; o++)
        for (let g = c; g <= i; g++) {
          const m = a(g, o);
          let p = e.get(m);
          (p || e.set(m, (p = [])), p.push(r));
        }
    },
    hits(r, c, i, h) {
      const [u, o, g, m] = s(r, c, i, h);
      for (let p = g; p <= m; p++)
        for (let x = u; x <= o; x++) {
          const f = e.get(a(x, p));
          if (f) {
            for (const T of f)
              if (
                r < T.x + T.w + z &&
                r + i + z > T.x &&
                c < T.y + T.h + z &&
                c + h + z > T.y
              )
                return !0;
          }
        }
      return !1;
    },
  };
}
var R, Z, ut, dt, ot, pt, rt, U, Y, lt, gt, $, tt, G, L, de, bt, Mt, Ot, pe, ge;
class xa {
  constructor(e, a = {}) {
    N(this, L);
    N(this, R);
    N(this, Z);
    N(this, ut);
    N(this, dt);
    N(this, ot, -1);
    N(this, pt, -1);
    N(this, rt, []);
    N(this, U, 0);
    N(this, Y, new Map());
    N(this, lt, -1);
    N(this, gt, 1);
    N(this, $);
    N(this, tt);
    N(this, G, !1);
    (C(this, R, e),
      C(this, Z, a.fill),
      C(this, ut, a.injectStyles ?? !0),
      C(this, dt, a.incremental ?? !1));
  }
  attach() {
    var s, r;
    if (typeof window > 'u' || v(this, G)) return;
    (v(this, ut) && ya(v(this, R).ownerDocument), this.pack());
    let e = 0;
    const a = () => {
      e ||
        (e = requestAnimationFrame(() => {
          ((e = 0),
            !v(this, G) &&
              (Math.abs(v(this, R).clientWidth - v(this, ot)) > 1
                ? this.pack()
                : Math.abs(v(this, R).clientHeight - v(this, pt)) > 1 &&
                  this.distribute()));
        }));
    };
    (C(this, tt, a),
      C(this, $, new ResizeObserver(a)),
      v(this, $).observe(v(this, R)),
      window.addEventListener('resize', a),
      (r = (s = document.fonts) == null ? void 0 : s.ready) == null ||
        r.then(() => {
          v(this, G) || this.pack();
        }));
  }
  refresh() {
    typeof window > 'u' ||
      v(this, G) ||
      (v(this, dt) && O(this, L, ge).call(this)) ||
      this.pack();
  }
  setFill(e) {
    (C(this, Z, e), typeof window < 'u' && !v(this, G) && this.distribute());
  }
  destroy() {
    var e;
    (C(this, G, !0),
      (e = v(this, $)) == null || e.disconnect(),
      C(this, $, void 0),
      v(this, tt) &&
        typeof window < 'u' &&
        window.removeEventListener('resize', v(this, tt)),
      C(this, tt, void 0));
  }
  pack() {
    const e = v(this, R),
      a = O(this, L, bt).call(this);
    if (!a.length) return;
    const s = e.clientWidth;
    if (s < 2) return;
    C(this, ot, s);
    const r =
        e.classList.contains('otc-packed') && O(this, L, Mt).call(this)
          ? O(this, L, Ot).call(this, a)
          : null,
      c = a.map((d) => {
        const y = parseFloat(d.dataset.weight ?? '');
        return Number.isFinite(y) ? y : 1;
      }),
      i = a.map((d) => d.dataset.key ?? d.textContent ?? ''),
      h = e.style.minHeight,
      u = a.map((d) => d.style.position);
    e.style.minHeight = '0px';
    for (const d of a) d.style.position = 'absolute';
    const o = e.clientHeight;
    ((e.style.minHeight = h), a.forEach((d, y) => (d.style.position = u[y])));
    const g = o > 40;
    e.classList.remove('otc-packed');
    for (const d of a)
      ((d.style.position = ''),
        (d.style.left = ''),
        (d.style.insetInlineStart = ''),
        (d.style.top = ''),
        (d.style.transform = ''));
    const m = s >= 380,
      p = (d) => {
        for (const y of a)
          ((y.style.whiteSpace = m ? 'nowrap' : 'normal'),
            (y.style.maxWidth = m
              ? `${Math.round(s * 0.6)}px`
              : 'min(6.5em, 100%)'),
            (y.style.fontSize = `${Math.max(8, parseFloat(y.dataset.fs || '12') * re(s) * d).toFixed(1)}px`));
      },
      x = () => a.map((d) => ({ el: d, w: d.offsetWidth, h: d.offsetHeight }));
    p(1);
    let f = x();
    const T = f.reduce((d, y) => d + (y.w + z) * (y.h + z), 0);
    let H = 1;
    g &&
      T > 0 &&
      (H = Math.min(2.5, Math.max(0.6, Math.sqrt((s * o) / (T * oe)))));
    const l = f.length,
      n = f.map((d, y) => y).sort((d, y) => c[y] - c[d]);
    let S = new Array(l),
      w = 0;
    const A = 3;
    for (let d = 0; d < A; d++) {
      (H !== 1 || d > 0) && (p(H), (f = x()));
      for (const _ of f)
        if (_.w > s) {
          const I = parseFloat(_.el.style.fontSize) || 12;
          ((_.el.style.fontSize = `${Math.max(9, I * (s / _.w)).toFixed(1)}px`),
            (_.w = _.el.offsetWidth),
            (_.h = _.el.offsetHeight));
        }
      const y = f.reduce((_, I) => _ + (I.w + z) * (I.h + z), 0),
        F = Math.max(g ? o : (y * oe) / s, 1),
        b = s / F,
        M = Math.max(1, Math.round(Math.sqrt(l * b))),
        E = Math.max(1, Math.ceil(l / M)),
        et = s / M,
        vt = F / E,
        Bt = [];
      for (let _ = 0; _ < E; _++)
        for (let I = 0; I < M; I++)
          Bt.push({ x: (I + 0.5) * et, y: (_ + 0.5) * vt });
      const Dt = s / 2,
        Ut = F / 2,
        K = Bt.slice(),
        at = [];
      (K.sort(
        (_, I) =>
          Math.hypot(_.x - Dt, _.y - Ut) - Math.hypot(I.x - Dt, I.y - Ut),
      ),
        at.push(K.shift()));
      const ct = K.map((_) => Math.hypot(_.x - at[0].x, _.y - at[0].y));
      for (; K.length;) {
        let _ = 0,
          I = -1;
        for (let P = 0; P < K.length; P++) ct[P] > I && ((I = ct[P]), (_ = P));
        const q = K.splice(_, 1)[0];
        (ct.splice(_, 1), at.push(q));
        for (let P = 0; P < K.length; P++) {
          const X = Math.hypot(K[P].x - q.x, K[P].y - q.y);
          X < ct[P] && (ct[P] = X);
        }
      }
      const { insert: me, hits: ve } = le();
      if (
        ((S = new Array(l)),
        (w = 0),
        n.forEach((_, I) => {
          const { w: q, h: P } = f[_],
            X = at[I % at.length];
          let _t = ie(i[_])() * Math.PI * 2,
            kt = 0,
            st = X.x - q / 2,
            Q = X.y - P / 2,
            ye = 0;
          for (
            ;
            (st = X.x - q / 2 + kt * Math.cos(_t)),
              (Q = X.y - P / 2 + kt * Math.sin(_t)),
              (st = Math.max(0, Math.min(st, s - q))),
              Q < 0 && (Q = 0),
              !(
                !ve(st, Q, q, P) ||
                ((_t += 0.5),
                (kt += Math.max(3, Math.min(et, vt) * 0.12)),
                ++ye > 4e3)
              );
          );
          (me({ x: st, y: Q, w: q, h: P }),
            (S[_] = { x: st, y: Q }),
            (w = Math.max(w, Q + P)));
        }),
        !g || d === A - 1 || w <= o * 1.08)
      )
        break;
      H = Math.max(0.5, H * (o / w) * 0.95);
    }
    for (const d of a) d.style.position = 'absolute';
    (C(
      this,
      rt,
      f.map((d, y) => ({ x: S[y].x, y: S[y].y, h: d.h })),
    ),
      C(this, U, Math.ceil(w)),
      C(this, lt, s),
      C(this, gt, H),
      C(
        this,
        Y,
        new Map(
          f.map((d, y) => [i[y], { x: S[y].x, y: S[y].y, w: d.w, h: d.h }]),
        ),
      ),
      e.classList.add('otc-packed'),
      (e.style.minHeight = `${v(this, U)}px`),
      this.distribute(r));
  }
  distribute(e) {
    const a = v(this, rt);
    if (!a.length) return;
    const s = O(this, L, bt).call(this);
    e === void 0 &&
      (e =
        v(this, R).classList.contains('otc-packed') && O(this, L, Mt).call(this)
          ? O(this, L, Ot).call(this, s)
          : null);
    const r = v(this, R).clientHeight;
    C(this, pt, r);
    let c = 1;
    if (v(this, L, de) && r > v(this, U) + 1) {
      c = 1 / 0;
      for (const i of a) i.y > 0.5 && (c = Math.min(c, (r - i.h) / i.y));
      ((!isFinite(c) || c < 1) && (c = 1), (c = Math.min(c, 4)));
    }
    (s.forEach((i, h) => {
      const u = a[h];
      if (!u) return;
      const o = c === 1 ? u.y : Math.min(u.y * c, Math.max(0, r - u.h));
      ((i.style.insetInlineStart = `${Math.round(u.x)}px`),
        (i.style.top = `${Math.round(o)}px`));
    }),
      e && O(this, L, pe).call(this, s, e));
  }
}
((R = new WeakMap()),
  (Z = new WeakMap()),
  (ut = new WeakMap()),
  (dt = new WeakMap()),
  (ot = new WeakMap()),
  (pt = new WeakMap()),
  (rt = new WeakMap()),
  (U = new WeakMap()),
  (Y = new WeakMap()),
  (lt = new WeakMap()),
  (gt = new WeakMap()),
  ($ = new WeakMap()),
  (tt = new WeakMap()),
  (G = new WeakMap()),
  (L = new WeakSet()),
  (de = function () {
    return v(this, Z) === 'height' || v(this, Z) === 'both';
  }),
  (bt = function () {
    return Array.from(v(this, R).querySelectorAll('.otc-tag'));
  }),
  (Mt = function () {
    if (
      typeof matchMedia < 'u' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return !1;
    const e = getComputedStyle(v(this, R))
      .getPropertyValue('--otc-move-transition')
      .trim();
    return e !== 'none' && e !== '0s' && e !== '0ms';
  }),
  (Ot = function (e) {
    const a = v(this, R).getBoundingClientRect(),
      s = new Map();
    for (const r of e) {
      const c = r.getBoundingClientRect();
      s.set(r.dataset.key ?? '', { x: c.left - a.left, y: c.top - a.top });
    }
    return s;
  }),
  (pe = function (e, a) {
    for (const i of e)
      ((i.style.transition = 'none'), (i.style.transform = ''));
    const s = v(this, R).getBoundingClientRect(),
      r = e.map((i) => {
        const h = i.getBoundingClientRect();
        return { el: i, x: h.left - s.left, y: h.top - s.top };
      });
    let c = !1;
    for (const { el: i, x: h, y: u } of r) {
      const o = a.get(i.dataset.key ?? '');
      if (o) {
        const g = o.x - h,
          m = o.y - u;
        (Math.abs(g) > 0.5 || Math.abs(m) > 0.5) &&
          ((i.style.transform = `translate(${g.toFixed(1)}px, ${m.toFixed(1)}px)`),
          (c = !0));
      } else ((i.style.transform = 'scale(0.5)'), (c = !0));
    }
    c && v(this, R).offsetWidth;
    for (const i of e) ((i.style.transition = ''), (i.style.transform = ''));
  }),
  (ge = function () {
    const e = v(this, R),
      a = O(this, L, bt).call(this);
    if (!a.length) return !1;
    const s = e.clientWidth;
    if (s < 2 || !v(this, Y).size || Math.abs(s - v(this, lt)) > 1) return !1;
    const r = O(this, L, Mt).call(this)
        ? new Map([...v(this, Y)].map(([l, n]) => [l, { x: n.x, y: n.y }]))
        : null,
      c = a.map((l) => {
        const n = parseFloat(l.dataset.weight ?? '');
        return Number.isFinite(n) ? n : 1;
      }),
      i = a.map((l) => l.dataset.key ?? l.textContent ?? ''),
      h = s >= 380;
    for (const l of a)
      ((l.style.whiteSpace = h ? 'nowrap' : 'normal'),
        (l.style.maxWidth = h
          ? `${Math.round(s * 0.6)}px`
          : 'min(6.5em, 100%)'),
        (l.style.fontSize = `${Math.max(8, parseFloat(l.dataset.fs || '12') * re(s) * v(this, gt)).toFixed(1)}px`),
        (l.style.transform = ''));
    const u = a.map((l) => ({ el: l, w: l.offsetWidth, h: l.offsetHeight }));
    for (const l of u)
      if (l.w > s) {
        const n = parseFloat(l.el.style.fontSize) || 12;
        ((l.el.style.fontSize = `${Math.max(9, n * (s / l.w)).toFixed(1)}px`),
          (l.w = l.el.offsetWidth),
          (l.h = l.el.offsetHeight));
      }
    const o = u.length,
      g = u.map((l, n) => n).sort((l, n) => c[n] - c[l]),
      { insert: m, hits: p } = le(),
      x = new Array(o),
      f = [];
    for (const l of g) {
      const n = v(this, Y).get(i[l]),
        { w: S, h: w } = u[l];
      n &&
      Math.abs(n.w - S) <= 1 &&
      Math.abs(n.h - w) <= 1 &&
      n.x + S <= s + 1 &&
      !p(n.x, n.y, S, w)
        ? (m({ x: n.x, y: n.y, w: S, h: w }), (x[l] = { x: n.x, y: n.y }))
        : f.push(l);
    }
    if (f.length > o * 0.4) return !1;
    const T = Math.max(
      3,
      Math.sqrt((s * Math.max(v(this, U), 1)) / Math.max(o, 1)) * 0.12,
    );
    let H = 0;
    for (const l of x) l && (H = Math.max(H, l.y));
    for (const l of f) {
      const { w: n, h: S } = u[l],
        w = v(this, Y).get(i[l]),
        A = ie(i[l]);
      let d = A() * Math.PI * 2;
      const y = w ? w.x + w.w / 2 : A() * s,
        F = w ? w.y + w.h / 2 : A() * Math.max(v(this, U), 1);
      let b = 0,
        M = y - n / 2,
        E = F - S / 2,
        et = 0;
      for (
        ;
        (M = y - n / 2 + b * Math.cos(d)),
          (E = F - S / 2 + b * Math.sin(d)),
          (M = Math.max(0, Math.min(M, s - n))),
          E < 0 && (E = 0),
          !(!p(M, E, n, S) || ((d += 0.5), (b += T), ++et > 4e3));
      );
      (m({ x: M, y: E, w: n, h: S }), (x[l] = { x: M, y: E }));
    }
    H = 0;
    for (let l = 0; l < o; l++) H = Math.max(H, x[l].y + u[l].h);
    for (const l of a) l.style.position = 'absolute';
    return (
      C(
        this,
        rt,
        u.map((l, n) => ({ x: x[n].x, y: x[n].y, h: l.h })),
      ),
      C(this, U, Math.ceil(H)),
      C(this, lt, s),
      C(this, ot, s),
      C(
        this,
        Y,
        new Map(
          u.map((l, n) => [i[n], { x: x[n].x, y: x[n].y, w: l.w, h: l.h }]),
        ),
      ),
      e.classList.add('otc-packed'),
      (e.style.minHeight = `${v(this, U)}px`),
      this.distribute(r),
      !0
    );
  }));
var ce = mt('<span class="otc-nb"> </span>'),
  wa = mt('<a></a>'),
  ba = mt('<span></span>'),
  Ma = mt('<div class="otc-cloud"></div>');
function It(t, e) {
  Je(e, !0);
  let a = wt(e, 'minPx', 3, 12),
    s = wt(e, 'maxPx', 3, 40),
    r = wt(e, 'minOpacity', 3, 0.62),
    c = wt(e, 'incremental', 3, !1);
  const i = Xe(() =>
    ma(e.items, {
      minPx: a(),
      maxPx: s(),
      minOpacity: r(),
      ariaLabel: e.ariaLabel,
    }),
  );
  let h, u;
  Qe(
    () => (
      (u = new xa(h, { fill: e.fill, incremental: c() })),
      u.attach(),
      () => (u == null ? void 0 : u.destroy())
    ),
  );
  let o = !0;
  (Xt(() => {
    if ((k(i), o)) {
      o = !1;
      return;
    }
    u == null || u.refresh();
  }),
    Xt(() => {
      u == null || u.setFill(e.fill);
    }));
  var g = Ma();
  (Rt(
    g,
    21,
    () => k(i),
    (m) => m.key,
    (m, p) => {
      var x = Et(),
        f = Ft(x);
      {
        var T = (l) => {
            var n = wa();
            (Rt(
              n,
              21,
              () => k(p).parts,
              Qt,
              (S, w) => {
                var A = Et(),
                  d = Ft(A);
                {
                  var y = (b) => {
                      var M = ce(),
                        E = it(M, !0);
                      (j(M), nt(() => xt(E, k(w).text)), B(b, M));
                    },
                    F = (b) => {
                      var M = qt();
                      (nt(() => xt(M, k(w).text)), B(b, M));
                    };
                  Pt(d, (b) => {
                    k(w).nowrap ? b(y) : b(F, -1);
                  });
                }
                B(S, A);
              },
            ),
              j(n),
              nt(() => {
                (te(n, 1, $t(k(p).className)),
                  W(n, 'href', k(p).item.href),
                  W(n, 'title', k(p).title),
                  W(n, 'aria-label', k(p).ariaLabel),
                  ee(n, k(p).style),
                  W(n, 'data-fs', k(p).fontPx),
                  W(n, 'data-weight', k(p).weight),
                  W(n, 'data-key', k(p).key));
              }),
              B(l, n));
          },
          H = (l) => {
            var n = ba();
            (Rt(
              n,
              21,
              () => k(p).parts,
              Qt,
              (S, w) => {
                var A = Et(),
                  d = Ft(A);
                {
                  var y = (b) => {
                      var M = ce(),
                        E = it(M, !0);
                      (j(M), nt(() => xt(E, k(w).text)), B(b, M));
                    },
                    F = (b) => {
                      var M = qt();
                      (nt(() => xt(M, k(w).text)), B(b, M));
                    };
                  Pt(d, (b) => {
                    k(w).nowrap ? b(y) : b(F, -1);
                  });
                }
                B(S, A);
              },
            ),
              j(n),
              nt(() => {
                (te(n, 1, $t(k(p).className)),
                  W(n, 'title', k(p).title),
                  W(n, 'aria-label', k(p).ariaLabel),
                  ee(n, k(p).style),
                  W(n, 'data-fs', k(p).fontPx),
                  W(n, 'data-weight', k(p).weight),
                  W(n, 'data-key', k(p).key));
              }),
              B(l, n));
          };
        Pt(f, (l) => {
          k(p).item.href ? l(T) : l(H, -1);
        });
      }
      B(m, x);
    },
  ),
    j(g),
    Ze(
      g,
      (m) => (h = m),
      () => h,
    ),
    B(t, g),
    Ve());
}
var _a =
  mt(`<main class="svelte-1uha8ag"><h1 class="svelte-1uha8ag">openTagCloud</h1> <p class="svelte-1uha8ag">A dependency-free, self-packing tag cloud component for Svelte 5.</p> <div class="box svelte-1uha8ag"><!></div> <h2>Custom sizes &amp; theming</h2> <p class="svelte-1uha8ag">Font range via <code class="svelte-1uha8ag">minPx</code>/<code class="svelte-1uha8ag">maxPx</code>; colors via the <code class="svelte-1uha8ag">--otc-color</code> and <code class="svelte-1uha8ag">--otc-hover-color</code> custom properties.</p> <div class="box themed svelte-1uha8ag"><!></div> <h2>Per-tag color</h2> <p class="svelte-1uha8ag">Give any tag its own <code class="svelte-1uha8ag">color</code> (any CSS color, incl. <code class="svelte-1uha8ag">var(--…)</code>) to highlight or categorize — here green for the most
    popular, red for the least.</p> <div class="box svelte-1uha8ag"><!></div></main>`);
function Fa(t) {
  const e = [
      { label: 'JavaScript', weight: 95, href: '#js' },
      { label: 'TypeScript', weight: 88, href: '#ts' },
      { label: 'Python', weight: 82, href: '#py' },
      { label: 'Rust', weight: 60, href: '#rust' },
      { label: 'Go', weight: 55, href: '#go' },
      { label: 'Svelte', weight: 70, href: '#svelte' },
      { label: 'Ruby', weight: 40, href: '#ruby' },
      { label: 'C++', weight: 45, href: '#cpp' },
      { label: 'Haskell', weight: 22, href: '#haskell' },
      { label: 'Elixir', weight: 30, href: '#elixir' },
      { label: 'Kotlin', weight: 38, href: '#kotlin' },
      { label: 'Swift', weight: 42, href: '#swift' },
      { label: 'Zig', weight: 18, href: '#zig' },
      { label: 'Clojure', weight: 20, href: '#clojure' },
      { label: 'PHP', weight: 48, href: '#php' },
      { label: 'Scala', weight: 26, href: '#scala' },
      { label: 'Lua', weight: 16, href: '#lua' },
      { label: 'C#', weight: 58, href: '#csharp' },
      { label: 'Dart', weight: 28, href: '#dart' },
      { label: 'Perl', weight: 12, href: '#perl' },
    ],
    a = e.map((g) => ({
      ...g,
      color: g.weight >= 65 ? '#16a34a' : g.weight <= 25 ? '#dc2626' : void 0,
    }));
  var s = _a(),
    r = Lt(it(s), 4),
    c = it(r);
  (It(c, {
    get items() {
      return e;
    },
  }),
    j(r));
  var i = Lt(r, 6),
    h = it(i);
  (It(h, {
    get items() {
      return e;
    },
    minPx: 14,
    maxPx: 56,
  }),
    j(i));
  var u = Lt(i, 6),
    o = it(u);
  (It(o, {
    get items() {
      return a;
    },
  }),
    j(u),
    j(s),
    B(t, s));
}
export { Fa as component };
