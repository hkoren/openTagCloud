var Yt = (t) => {
  throw TypeError(t);
};
var Et = (t, e, a) => e.has(t) || Yt('Cannot ' + a);
var m = (t, e, a) => (
    Et(t, e, 'read from private field'),
    a ? a.call(t) : e.get(t)
  ),
  P = (t, e, a) =>
    e.has(t)
      ? Yt('Cannot add the same private member more than once')
      : e instanceof WeakSet
        ? e.add(t)
        : e.set(t, a),
  E = (t, e, a, s) => (
    Et(t, e, 'write to private field'),
    s ? s.call(t, a) : e.set(t, a),
    a
  ),
  W = (t, e, a) => (Et(t, e, 'access private method'), a);
import { a as D, f as yt, c as Tt, t as Gt } from '../chunks/CFiLYvC6.js';
import {
  c as Ct,
  i as be,
  h as U,
  z as At,
  X as Me,
  w as _e,
  G as k,
  x as ke,
  a7 as Se,
  y as jt,
  A as Ht,
  e as xt,
  ao as Ee,
  aw as Te,
  ag as Jt,
  a as Ce,
  aF as V,
  b as zt,
  aG as Ae,
  s as He,
  U as Fe,
  aH as Le,
  aI as Pe,
  aA as Re,
  a3 as Vt,
  aJ as Ie,
  M as Ne,
  r as ue,
  p as de,
  aK as Ft,
  aL as ze,
  at as Oe,
  m as We,
  d as Be,
  av as Bt,
  aM as De,
  aq as Ue,
  aN as Xt,
  aO as Qt,
  aP as Ke,
  aQ as qe,
  aR as Ye,
  aS as Ge,
  aT as je,
  aU as Je,
  aV as Ve,
  k as Xe,
  u as Zt,
  n as Qe,
  j as Lt,
  q as J,
  t as it,
  aE as Ze,
  o as ot,
  v as Pt,
} from '../chunks/Dhq6kDMD.js';
import { o as $e } from '../chunks/CHCS7o2d.js';
import { s as wt } from '../chunks/Cz55Lnah.js';
import { p as bt, b as ta, i as Rt } from '../chunks/F1HylrHd.js';
function $t(t, e) {
  return e;
}
function ea(t, e, a) {
  for (var s = [], o = e.length, l, i = e.length, c = 0; c < o; c++) {
    let v = e[c];
    de(
      v,
      () => {
        if (l) {
          if ((l.pending.delete(v), l.done.add(v), l.pending.size === 0)) {
            var g = t.outrogroups;
            (Ot(t, Bt(l.done)),
              g.delete(l),
              g.size === 0 && (t.outrogroups = null));
          }
        } else i -= 1;
      },
      !1,
    );
  }
  if (i === 0) {
    var f = s.length === 0 && a !== null;
    if (f) {
      var r = a,
        p = r.parentNode;
      (Oe(p), p.append(r), t.items.clear());
    }
    Ot(t, e, !f);
  } else
    ((l = { pending: new Set(e), done: new Set() }),
      (t.outrogroups ?? (t.outrogroups = new Set())).add(l));
}
function Ot(t, e, a = !0) {
  var s;
  if (t.pending.size > 0) {
    s = new Set();
    for (const i of t.pending.values())
      for (const c of i) s.add(t.items.get(c).e);
  }
  for (var o = 0; o < e.length; o++) {
    var l = e[o];
    if (s != null && s.has(l)) {
      l.f |= V;
      const i = document.createDocumentFragment();
      We(l, i);
    } else Be(e[o], a);
  }
}
var te;
function It(t, e, a, s, o, l = null) {
  var i = t,
    c = new Map();
  {
    var f = t;
    i = U ? At(Me(f)) : f.appendChild(Ct());
  }
  U && _e();
  var r = null,
    p = Fe(() => {
      var n = a();
      return De(n) ? n : n == null ? [] : Bt(n);
    }),
    v,
    g = new Map(),
    S = !0;
  function h(n) {
    (b.effect.f & Ne) === 0 &&
      (b.pending.delete(n),
      (b.fallback = r),
      aa(b, v, i, e, s),
      r !== null &&
        (v.length === 0
          ? (r.f & V) === 0
            ? ue(r)
            : ((r.f ^= V), dt(r, null, i))
          : de(r, () => {
              r = null;
            })));
  }
  function T(n) {
    b.pending.delete(n);
  }
  var N = be(() => {
      v = k(p);
      var n = v.length;
      let d = !1;
      if (U) {
        var w = ke(i) === Se;
        w !== (n === 0) && ((i = jt()), At(i), Ht(!1), (d = !0));
      }
      for (var M = new Set(), u = Ce, y = He(), F = 0; F < n; F += 1) {
        U &&
          xt.nodeType === Ee &&
          xt.data === Te &&
          ((i = xt), (d = !0), Ht(!1));
        var x = v[F],
          C = s(x, F),
          A = S ? null : c.get(C);
        (A
          ? (A.v && Jt(A.v, x), A.i && Jt(A.i, F), y && u.unskip_effect(A.e))
          : ((A = sa(c, S ? i : (te ?? (te = Ct())), x, C, F, o, e, a)),
            S || (A.e.f |= V),
            c.set(C, A)),
          M.add(C));
      }
      if (
        (n === 0 &&
          l &&
          !r &&
          (S
            ? (r = zt(() => l(i)))
            : ((r = zt(() => l(te ?? (te = Ct())))), (r.f |= V))),
        n > M.size && Ae(),
        U && n > 0 && At(jt()),
        !S)
      )
        if ((g.set(u, M), y)) {
          for (const [O, at] of c) M.has(O) || u.skip_effect(at.e);
          (u.oncommit(h), u.ondiscard(T));
        } else h(u);
      (d && Ht(!0), k(p));
    }),
    b = { effect: N, items: c, pending: g, outrogroups: null, fallback: r };
  ((S = !1), U && (i = xt));
}
function ut(t) {
  for (; t !== null && (t.f & ze) === 0;) t = t.next;
  return t;
}
function aa(t, e, a, s, o) {
  var F;
  var l = e.length,
    i = t.items,
    c = ut(t.effect.first),
    f,
    r = null,
    p = [],
    v = [],
    g,
    S,
    h,
    T;
  for (T = 0; T < l; T += 1) {
    if (((g = e[T]), (S = o(g, T)), (h = i.get(S).e), t.outrogroups !== null))
      for (const x of t.outrogroups) (x.pending.delete(h), x.done.delete(h));
    if (((h.f & Ft) !== 0 && ue(h), (h.f & V) !== 0))
      if (((h.f ^= V), h === c)) dt(h, null, a);
      else {
        var N = r ? r.next : c;
        (h === t.effect.last && (t.effect.last = h.prev),
          h.prev && (h.prev.next = h.next),
          h.next && (h.next.prev = h.prev),
          X(t, r, h),
          X(t, h, N),
          dt(h, N, a),
          (r = h),
          (p = []),
          (v = []),
          (c = ut(r.next)));
        continue;
      }
    if (h !== c) {
      if (f !== void 0 && f.has(h)) {
        if (p.length < v.length) {
          var b = v[0],
            n;
          r = b.prev;
          var d = p[0],
            w = p[p.length - 1];
          for (n = 0; n < p.length; n += 1) dt(p[n], b, a);
          for (n = 0; n < v.length; n += 1) f.delete(v[n]);
          (X(t, d.prev, w.next),
            X(t, r, d),
            X(t, w, b),
            (c = b),
            (r = w),
            (T -= 1),
            (p = []),
            (v = []));
        } else
          (f.delete(h),
            dt(h, c, a),
            X(t, h.prev, h.next),
            X(t, h, r === null ? t.effect.first : r.next),
            X(t, r, h),
            (r = h));
        continue;
      }
      for (p = [], v = []; c !== null && c !== h;)
        ((f ?? (f = new Set())).add(c), v.push(c), (c = ut(c.next)));
      if (c === null) continue;
    }
    ((h.f & V) === 0 && p.push(h), (r = h), (c = ut(h.next)));
  }
  if (t.outrogroups !== null) {
    for (const x of t.outrogroups)
      x.pending.size === 0 &&
        (Ot(t, Bt(x.done)), (F = t.outrogroups) == null || F.delete(x));
    t.outrogroups.size === 0 && (t.outrogroups = null);
  }
  if (c !== null || f !== void 0) {
    var M = [];
    if (f !== void 0) for (h of f) (h.f & Ft) === 0 && M.push(h);
    for (; c !== null;)
      ((c.f & Ft) === 0 && c !== t.fallback && M.push(c), (c = ut(c.next)));
    var u = M.length;
    if (u > 0) {
      var y = l === 0 ? a : null;
      ea(t, M, y);
    }
  }
}
function sa(t, e, a, s, o, l, i, c) {
  var f = (i & Le) !== 0 ? ((i & Pe) === 0 ? Re(a, !1, !1) : Vt(a)) : null,
    r = (i & Ie) !== 0 ? Vt(o) : null;
  return {
    v: f,
    i: r,
    e: zt(
      () => (
        l(e, f ?? a, r ?? o, c),
        () => {
          t.delete(s);
        }
      ),
    ),
  };
}
function dt(t, e, a) {
  if (t.nodes)
    for (
      var s = t.nodes.start,
        o = t.nodes.end,
        l = e && (e.f & V) === 0 ? e.nodes.start : a;
      s !== null;
    ) {
      var i = Ue(s);
      if ((l.before(s), s === o)) return;
      s = i;
    }
}
function X(t, e, a) {
  (e === null ? (t.effect.first = a) : (e.next = a),
    a === null ? (t.effect.last = e) : (a.prev = e));
}
function pe(t) {
  var e,
    a,
    s = '';
  if (typeof t == 'string' || typeof t == 'number') s += t;
  else if (typeof t == 'object')
    if (Array.isArray(t)) {
      var o = t.length;
      for (e = 0; e < o; e++)
        t[e] && (a = pe(t[e])) && (s && (s += ' '), (s += a));
    } else for (a in t) t[a] && (s && (s += ' '), (s += a));
  return s;
}
function na() {
  for (var t, e, a = 0, s = '', o = arguments.length; a < o; a++)
    (t = arguments[a]) && (e = pe(t)) && (s && (s += ' '), (s += e));
  return s;
}
function ee(t) {
  return typeof t == 'object' ? na(t) : (t ?? '');
}
function ia(t, e, a) {
  var s = t == null ? '' : '' + t;
  return s === '' ? null : s;
}
function oa(t, e) {
  return t == null ? null : String(t);
}
function ae(t, e, a, s, o, l) {
  var i = t[Xt];
  if (U || i !== a || i === void 0) {
    var c = ia(a);
    ((!U || c !== t.getAttribute('class')) &&
      (c == null ? t.removeAttribute('class') : (t.className = c)),
      (t[Xt] = a));
  }
  return l;
}
function se(t, e, a, s) {
  var o = t[Qt];
  if (U || o !== e) {
    var l = oa(e);
    ((!U || l !== t.getAttribute('style')) &&
      (l == null ? t.removeAttribute('style') : (t.style.cssText = l)),
      (t[Qt] = e));
  }
  return s;
}
const ra = Symbol('is custom element'),
  la = Symbol('is html'),
  ca = Ge ? 'link' : 'LINK';
function B(t, e, a, s) {
  var o = ha(t);
  (U &&
    ((o[e] = t.getAttribute(e)),
    e === 'src' || e === 'srcset' || (e === 'href' && t.nodeName === ca))) ||
    (o[e] !== (o[e] = a) &&
      (e === 'loading' && (t[Ke] = a),
      a == null
        ? t.removeAttribute(e)
        : typeof a != 'string' && fa(t).includes(e)
          ? (t[e] = a)
          : t.setAttribute(e, a)));
}
function ha(t) {
  var e;
  return (
    t[(e = qe)] ??
    (t[e] = { [ra]: t.nodeName.includes('-'), [la]: t.namespaceURI === Ye })
  );
}
var ne = new Map();
function fa(t) {
  var e = t.getAttribute('is') || t.nodeName,
    a = ne.get(e);
  if (a) return a;
  ne.set(e, (a = []));
  for (var s, o = t, l = Element.prototype; l !== o;) {
    s = Je(o);
    for (var i in s)
      s[i].set &&
        i !== 'innerHTML' &&
        i !== 'textContent' &&
        i !== 'innerText' &&
        a.push(i);
    o = je(o);
  }
  return a;
}
Ve();
const ua = (t) => t.id ?? t.label,
  da = 1.9,
  pa = 9;
let ie = !1;
function ga(t) {
  return Number.isFinite(t) && t >= 0
    ? t
    : (ie ||
        ((ie = !0),
        console.warn(
          'opentagcloud: negative or non-finite tag weight(s) clamped to 0',
        )),
      0);
}
function ma(t) {
  const e = t.length,
    a = Math.max(...t.split(/\s+/).map((s) => s.length));
  return Math.max(
    0.45,
    Math.min(Math.min(1, 15 / Math.max(15, e)), 11 / Math.max(11, a)),
  );
}
function va(t) {
  const e = [];
  for (const a of t.split(/(\s+)/)) {
    if (!a) continue;
    const s = !/\s/.test(a) && a.includes('-'),
      o = e[e.length - 1];
    !s && o && !o.nowrap ? (o.text += a) : e.push({ text: a, nowrap: s });
  }
  return e;
}
function ya(t, e = {}) {
  const {
      minPx: a = 12,
      maxPx: s = 40,
      minOpacity: o = 0.62,
      ariaLabel: l,
    } = e,
    i = t.map((r) => ga(r.weight)),
    c = Math.max(1, ...i),
    f = Math.min(1.1, Math.max(0.5, Math.sqrt(18 / Math.max(1, t.length))));
  return t.map((r, p) => {
    const v = i[p],
      g = a + Math.pow(v / c, da) * (s - a),
      S = +Math.max(pa, g * f * ma(r.label)).toFixed(1),
      h = +(o + Math.pow(v / c, 0.8) * (1 - o)).toFixed(2);
    return {
      item: r,
      key: ua(r),
      weight: v,
      text: r.label,
      parts: va(r.label),
      fontPx: S,
      opacity: h,
      title: r.title ?? String(r.weight),
      ariaLabel: l
        ? typeof l == 'function'
          ? l(r)
          : `${r.label}, weight ${r.weight}`
        : void 0,
      className: r.class ? `otc-tag ${r.class}` : 'otc-tag',
      style: `font-size:${S}px;opacity:${h};${r.color ? `--otc-tag-color:${r.color};` : ''}`,
    };
  });
}
const xa = `.otc-cloud {
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
  oe = 'opentagcloud-css';
function wa(t) {
  const e = t ?? (typeof document > 'u' ? void 0 : document);
  if (!e || e.getElementById(oe)) return;
  const a = e.createElement('style');
  ((a.id = oe), (a.textContent = xa), e.head.appendChild(a));
}
function re(t) {
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
  le = 1.4,
  ce = (t) => Math.min(1.25, Math.max(0.72, t / 460));
function he() {
  const e = new Map(),
    a = (o, l) => l * 8192 + o,
    s = (o, l, i, c) => [
      Math.max(0, Math.floor((o - z) / 64)),
      Math.max(0, Math.floor((o + i + z) / 64)),
      Math.max(0, Math.floor((l - z) / 64)),
      Math.max(0, Math.floor((l + c + z) / 64)),
    ];
  return {
    insert(o) {
      const [l, i, c, f] = s(o.x, o.y, o.w, o.h);
      for (let r = c; r <= f; r++)
        for (let p = l; p <= i; p++) {
          const v = a(p, r);
          let g = e.get(v);
          (g || e.set(v, (g = [])), g.push(o));
        }
    },
    hits(o, l, i, c) {
      const [f, r, p, v] = s(o, l, i, c);
      for (let g = p; g <= v; g++)
        for (let S = f; S <= r; S++) {
          const h = e.get(a(S, g));
          if (h) {
            for (const T of h)
              if (
                o < T.x + T.w + z &&
                o + i + z > T.x &&
                l < T.y + T.h + z &&
                l + c + z > T.y
              )
                return !0;
          }
        }
      return !1;
    },
  };
}
var R,
  $,
  pt,
  gt,
  rt,
  mt,
  lt,
  K,
  G,
  ct,
  vt,
  tt,
  et,
  j,
  ht,
  H,
  ge,
  Mt,
  _t,
  Wt,
  me,
  ve;
class ba {
  constructor(e, a = {}) {
    P(this, H);
    P(this, R);
    P(this, $);
    P(this, pt);
    P(this, gt);
    P(this, rt, -1);
    P(this, mt, -1);
    P(this, lt, []);
    P(this, K, 0);
    P(this, G, new Map());
    P(this, ct, -1);
    P(this, vt, 1);
    P(this, tt);
    P(this, et);
    P(this, j, !1);
    P(this, ht, !1);
    (E(this, R, e),
      E(this, $, a.fill),
      E(this, pt, a.injectStyles ?? !0),
      E(this, gt, a.incremental ?? !1));
  }
  attach() {
    var s, o;
    if (typeof window > 'u' || m(this, j)) return;
    (m(this, pt) && wa(m(this, R).ownerDocument), this.pack());
    let e = 0;
    const a = () => {
      e ||
        (e = requestAnimationFrame(() => {
          ((e = 0),
            !m(this, j) &&
              (Math.abs(m(this, R).clientWidth - m(this, rt)) > 1
                ? this.pack()
                : Math.abs(m(this, R).clientHeight - m(this, mt)) > 1 &&
                  this.distribute()));
        }));
    };
    (E(this, et, a),
      E(this, tt, new ResizeObserver(a)),
      m(this, tt).observe(m(this, R)),
      window.addEventListener('resize', a),
      (o = (s = document.fonts) == null ? void 0 : s.ready) == null ||
        o.then(() => {
          if (!m(this, j)) {
            E(this, ht, !0);
            try {
              this.pack();
            } finally {
              E(this, ht, !1);
            }
          }
        }));
  }
  refresh() {
    typeof window > 'u' ||
      m(this, j) ||
      (m(this, gt) && W(this, H, ve).call(this)) ||
      this.pack();
  }
  setFill(e) {
    (E(this, $, e), typeof window < 'u' && !m(this, j) && this.distribute());
  }
  destroy() {
    var e;
    (E(this, j, !0),
      (e = m(this, tt)) == null || e.disconnect(),
      E(this, tt, void 0),
      m(this, et) &&
        typeof window < 'u' &&
        window.removeEventListener('resize', m(this, et)),
      E(this, et, void 0));
  }
  pack() {
    const e = m(this, R),
      a = W(this, H, Mt).call(this);
    if (!a.length) return;
    const s = e.clientWidth;
    if (s < 2) return;
    E(this, rt, s);
    const o =
        e.classList.contains('otc-packed') &&
        !m(this, ht) &&
        W(this, H, _t).call(this)
          ? W(this, H, Wt).call(this, a)
          : null,
      l = a.map((u) => {
        const y = parseFloat(u.dataset.weight ?? '');
        return Number.isFinite(y) ? y : 1;
      }),
      i = a.map((u) => u.dataset.key ?? u.textContent ?? ''),
      c = e.style.minHeight,
      f = a.map((u) => u.style.position);
    e.style.minHeight = '0px';
    for (const u of a) u.style.position = 'absolute';
    const r = e.clientHeight;
    ((e.style.minHeight = c), a.forEach((u, y) => (u.style.position = f[y])));
    const p = r > 40;
    e.classList.remove('otc-packed');
    for (const u of a)
      ((u.style.position = ''),
        (u.style.left = ''),
        (u.style.insetInlineStart = ''),
        (u.style.top = ''),
        (u.style.transform = ''));
    const v = s >= 380,
      g = (u) => {
        for (const y of a)
          ((y.style.whiteSpace = v ? 'nowrap' : 'normal'),
            (y.style.maxWidth = v ? 'none' : 'min(6.5em, 100%)'),
            (y.style.fontSize = `${Math.max(8, parseFloat(y.dataset.fs || '12') * ce(s) * u).toFixed(1)}px`));
      },
      S = () => a.map((u) => ({ el: u, w: u.offsetWidth, h: u.offsetHeight }));
    g(1);
    let h = S();
    const T = h.reduce((u, y) => u + (y.w + z) * (y.h + z), 0);
    let N = 1;
    p &&
      T > 0 &&
      (N = Math.min(2.5, Math.max(0.6, Math.sqrt((s * r) / (T * le)))));
    const b = h.length,
      n = h.map((u, y) => y).sort((u, y) => l[y] - l[u]);
    let d = new Array(b),
      w = 0;
    const M = 3;
    for (let u = 0; u < M; u++) {
      (N !== 1 || u > 0) && (g(N), (h = S()));
      const y = v ? s * 0.85 : s;
      for (const _ of h)
        if (_.w > y) {
          const I = parseFloat(_.el.style.fontSize) || 12;
          ((_.el.style.fontSize = `${Math.max(9, I * (y / _.w)).toFixed(1)}px`),
            (_.w = _.el.offsetWidth),
            (_.h = _.el.offsetHeight));
        }
      const F = h.reduce((_, I) => _ + (I.w + z) * (I.h + z), 0),
        x = Math.max(p ? r : (F * le) / s, 1),
        C = s / x,
        A = Math.max(1, Math.round(Math.sqrt(b * C))),
        O = Math.max(1, Math.ceil(b / A)),
        at = s / A,
        Dt = x / O,
        Ut = [];
      for (let _ = 0; _ < O; _++)
        for (let I = 0; I < A; I++)
          Ut.push({ x: (I + 0.5) * at, y: (_ + 0.5) * Dt });
      const Kt = s / 2,
        qt = x / 2,
        q = Ut.slice(),
        st = [];
      (q.sort(
        (_, I) =>
          Math.hypot(_.x - Kt, _.y - qt) - Math.hypot(I.x - Kt, I.y - qt),
      ),
        st.push(q.shift()));
      const ft = q.map((_) => Math.hypot(_.x - st[0].x, _.y - st[0].y));
      for (; q.length;) {
        let _ = 0,
          I = -1;
        for (let L = 0; L < q.length; L++) ft[L] > I && ((I = ft[L]), (_ = L));
        const Y = q.splice(_, 1)[0];
        (ft.splice(_, 1), st.push(Y));
        for (let L = 0; L < q.length; L++) {
          const Q = Math.hypot(q[L].x - Y.x, q[L].y - Y.y);
          Q < ft[L] && (ft[L] = Q);
        }
      }
      const { insert: ye, hits: xe } = he();
      if (
        ((d = new Array(b)),
        (w = 0),
        n.forEach((_, I) => {
          const { w: Y, h: L } = h[_],
            Q = st[I % st.length];
          let kt = re(i[_])() * Math.PI * 2,
            St = 0,
            nt = Q.x - Y / 2,
            Z = Q.y - L / 2,
            we = 0;
          for (
            ;
            (nt = Q.x - Y / 2 + St * Math.cos(kt)),
              (Z = Q.y - L / 2 + St * Math.sin(kt)),
              (nt = Math.max(0, Math.min(nt, s - Y))),
              Z < 0 && (Z = 0),
              !(
                !xe(nt, Z, Y, L) ||
                ((kt += 0.5),
                (St += Math.max(3, Math.min(at, Dt) * 0.12)),
                ++we > 4e3)
              );
          );
          (ye({ x: nt, y: Z, w: Y, h: L }),
            (d[_] = { x: nt, y: Z }),
            (w = Math.max(w, Z + L)));
        }),
        !p || u === M - 1 || w <= r * 1.08)
      )
        break;
      N = Math.max(0.5, N * (r / w) * 0.95);
    }
    for (const u of a) u.style.position = 'absolute';
    (E(
      this,
      lt,
      h.map((u, y) => ({ x: d[y].x, y: d[y].y, h: u.h })),
    ),
      E(this, K, Math.ceil(w)),
      E(this, ct, s),
      E(this, vt, N),
      E(
        this,
        G,
        new Map(
          h.map((u, y) => [i[y], { x: d[y].x, y: d[y].y, w: u.w, h: u.h }]),
        ),
      ),
      e.classList.add('otc-packed'),
      (e.style.minHeight = `${m(this, K)}px`),
      this.distribute(o));
  }
  distribute(e) {
    const a = m(this, lt);
    if (!a.length) return;
    const s = W(this, H, Mt).call(this);
    e === void 0 &&
      (e =
        m(this, R).classList.contains('otc-packed') && W(this, H, _t).call(this)
          ? W(this, H, Wt).call(this, s)
          : null);
    const o = m(this, R).clientHeight;
    E(this, mt, o);
    let l = 1;
    if (m(this, H, ge) && o > m(this, K) + 1) {
      l = 1 / 0;
      for (const i of a) i.y > 0.5 && (l = Math.min(l, (o - i.h) / i.y));
      ((!isFinite(l) || l < 1) && (l = 1), (l = Math.min(l, 4)));
    }
    (s.forEach((i, c) => {
      const f = a[c];
      if (!f) return;
      const r = l === 1 ? f.y : Math.min(f.y * l, Math.max(0, o - f.h));
      ((i.style.insetInlineStart = `${Math.round(f.x)}px`),
        (i.style.top = `${Math.round(r)}px`));
    }),
      e && W(this, H, me).call(this, s, e));
  }
}
((R = new WeakMap()),
  ($ = new WeakMap()),
  (pt = new WeakMap()),
  (gt = new WeakMap()),
  (rt = new WeakMap()),
  (mt = new WeakMap()),
  (lt = new WeakMap()),
  (K = new WeakMap()),
  (G = new WeakMap()),
  (ct = new WeakMap()),
  (vt = new WeakMap()),
  (tt = new WeakMap()),
  (et = new WeakMap()),
  (j = new WeakMap()),
  (ht = new WeakMap()),
  (H = new WeakSet()),
  (ge = function () {
    return m(this, $) === 'height' || m(this, $) === 'both';
  }),
  (Mt = function () {
    return Array.from(m(this, R).querySelectorAll('.otc-tag'));
  }),
  (_t = function () {
    if (
      typeof matchMedia < 'u' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return !1;
    const e = getComputedStyle(m(this, R))
      .getPropertyValue('--otc-move-transition')
      .trim();
    return e !== 'none' && e !== '0s' && e !== '0ms';
  }),
  (Wt = function (e) {
    const a = m(this, R).getBoundingClientRect(),
      s = new Map();
    for (const o of e) {
      const l = o.getBoundingClientRect();
      s.set(o.dataset.key ?? '', { x: l.left - a.left, y: l.top - a.top });
    }
    return s;
  }),
  (me = function (e, a) {
    for (const i of e)
      ((i.style.transition = 'none'), (i.style.transform = ''));
    const s = m(this, R).getBoundingClientRect(),
      o = e.map((i) => {
        const c = i.getBoundingClientRect();
        return { el: i, x: c.left - s.left, y: c.top - s.top };
      });
    let l = !1;
    for (const { el: i, x: c, y: f } of o) {
      const r = a.get(i.dataset.key ?? '');
      if (r) {
        const p = r.x - c,
          v = r.y - f;
        (Math.abs(p) > 0.5 || Math.abs(v) > 0.5) &&
          ((i.style.transform = `translate(${p.toFixed(1)}px, ${v.toFixed(1)}px)`),
          (l = !0));
      } else ((i.style.transform = 'scale(0.5)'), (l = !0));
    }
    l && m(this, R).offsetWidth;
    for (const i of e) ((i.style.transition = ''), (i.style.transform = ''));
  }),
  (ve = function () {
    const e = m(this, R),
      a = W(this, H, Mt).call(this);
    if (!a.length) return !1;
    const s = e.clientWidth;
    if (s < 2 || !m(this, G).size || Math.abs(s - m(this, ct)) > 1) return !1;
    const o = W(this, H, _t).call(this)
        ? new Map([...m(this, G)].map(([n, d]) => [n, { x: d.x, y: d.y }]))
        : null,
      l = a.map((n) => {
        const d = parseFloat(n.dataset.weight ?? '');
        return Number.isFinite(d) ? d : 1;
      }),
      i = a.map((n) => n.dataset.key ?? n.textContent ?? ''),
      c = s >= 380;
    for (const n of a)
      ((n.style.whiteSpace = c ? 'nowrap' : 'normal'),
        (n.style.maxWidth = c ? 'none' : 'min(6.5em, 100%)'),
        (n.style.fontSize = `${Math.max(8, parseFloat(n.dataset.fs || '12') * ce(s) * m(this, vt)).toFixed(1)}px`),
        (n.style.transform = ''));
    const f = a.map((n) => ({ el: n, w: n.offsetWidth, h: n.offsetHeight })),
      r = c ? s * 0.85 : s;
    for (const n of f)
      if (n.w > r) {
        const d = parseFloat(n.el.style.fontSize) || 12;
        ((n.el.style.fontSize = `${Math.max(9, d * (r / n.w)).toFixed(1)}px`),
          (n.w = n.el.offsetWidth),
          (n.h = n.el.offsetHeight));
      }
    const p = f.length,
      v = f.map((n, d) => d).sort((n, d) => l[d] - l[n]),
      { insert: g, hits: S } = he(),
      h = new Array(p),
      T = [];
    for (const n of v) {
      const d = m(this, G).get(i[n]),
        { w, h: M } = f[n];
      d &&
      Math.abs(d.w - w) <= 1 &&
      Math.abs(d.h - M) <= 1 &&
      d.x + w <= s + 1 &&
      !S(d.x, d.y, w, M)
        ? (g({ x: d.x, y: d.y, w, h: M }), (h[n] = { x: d.x, y: d.y }))
        : T.push(n);
    }
    if (T.length > p * 0.4) return !1;
    const N = Math.max(
      3,
      Math.sqrt((s * Math.max(m(this, K), 1)) / Math.max(p, 1)) * 0.12,
    );
    let b = 0;
    for (const n of h) n && (b = Math.max(b, n.y));
    for (const n of T) {
      const { w: d, h: w } = f[n],
        M = m(this, G).get(i[n]),
        u = re(i[n]);
      let y = u() * Math.PI * 2;
      const F = M ? M.x + M.w / 2 : u() * s,
        x = M ? M.y + M.h / 2 : u() * Math.max(m(this, K), 1);
      let C = 0,
        A = F - d / 2,
        O = x - w / 2,
        at = 0;
      for (
        ;
        (A = F - d / 2 + C * Math.cos(y)),
          (O = x - w / 2 + C * Math.sin(y)),
          (A = Math.max(0, Math.min(A, s - d))),
          O < 0 && (O = 0),
          !(!S(A, O, d, w) || ((y += 0.5), (C += N), ++at > 4e3));
      );
      (g({ x: A, y: O, w: d, h: w }), (h[n] = { x: A, y: O }));
    }
    b = 0;
    for (let n = 0; n < p; n++) b = Math.max(b, h[n].y + f[n].h);
    for (const n of a) n.style.position = 'absolute';
    return (
      E(
        this,
        lt,
        f.map((n, d) => ({ x: h[d].x, y: h[d].y, h: n.h })),
      ),
      E(this, K, Math.ceil(b)),
      E(this, ct, s),
      E(this, rt, s),
      E(
        this,
        G,
        new Map(
          f.map((n, d) => [i[d], { x: h[d].x, y: h[d].y, w: n.w, h: n.h }]),
        ),
      ),
      e.classList.add('otc-packed'),
      (e.style.minHeight = `${m(this, K)}px`),
      this.distribute(o),
      !0
    );
  }));
var fe = yt('<span class="otc-nb"> </span>'),
  Ma = yt('<a></a>'),
  _a = yt('<span></span>'),
  ka = yt('<div class="otc-cloud"></div>');
function Nt(t, e) {
  Xe(e, !0);
  let a = bt(e, 'minPx', 3, 12),
    s = bt(e, 'maxPx', 3, 40),
    o = bt(e, 'minOpacity', 3, 0.62),
    l = bt(e, 'incremental', 3, !1);
  const i = Ze(() =>
    ya(e.items, {
      minPx: a(),
      maxPx: s(),
      minOpacity: o(),
      ariaLabel: e.ariaLabel,
    }),
  );
  let c, f;
  $e(
    () => (
      (f = new ba(c, { fill: e.fill, incremental: l() })),
      f.attach(),
      () => (f == null ? void 0 : f.destroy())
    ),
  );
  let r = !0;
  (Zt(() => {
    if ((k(i), r)) {
      r = !1;
      return;
    }
    f == null || f.refresh();
  }),
    Zt(() => {
      f == null || f.setFill(e.fill);
    }));
  var p = ka();
  (It(
    p,
    21,
    () => k(i),
    (v) => v.key,
    (v, g) => {
      var S = Tt(),
        h = Lt(S);
      {
        var T = (b) => {
            var n = Ma();
            (It(
              n,
              21,
              () => k(g).parts,
              $t,
              (d, w) => {
                var M = Tt(),
                  u = Lt(M);
                {
                  var y = (x) => {
                      var C = fe(),
                        A = ot(C, !0);
                      (J(C), it(() => wt(A, k(w).text)), D(x, C));
                    },
                    F = (x) => {
                      var C = Gt();
                      (it(() => wt(C, k(w).text)), D(x, C));
                    };
                  Rt(u, (x) => {
                    k(w).nowrap ? x(y) : x(F, -1);
                  });
                }
                D(d, M);
              },
            ),
              J(n),
              it(() => {
                (ae(n, 1, ee(k(g).className)),
                  B(n, 'href', k(g).item.href),
                  B(n, 'title', k(g).title),
                  B(n, 'aria-label', k(g).ariaLabel),
                  se(n, k(g).style),
                  B(n, 'data-fs', k(g).fontPx),
                  B(n, 'data-weight', k(g).weight),
                  B(n, 'data-key', k(g).key));
              }),
              D(b, n));
          },
          N = (b) => {
            var n = _a();
            (It(
              n,
              21,
              () => k(g).parts,
              $t,
              (d, w) => {
                var M = Tt(),
                  u = Lt(M);
                {
                  var y = (x) => {
                      var C = fe(),
                        A = ot(C, !0);
                      (J(C), it(() => wt(A, k(w).text)), D(x, C));
                    },
                    F = (x) => {
                      var C = Gt();
                      (it(() => wt(C, k(w).text)), D(x, C));
                    };
                  Rt(u, (x) => {
                    k(w).nowrap ? x(y) : x(F, -1);
                  });
                }
                D(d, M);
              },
            ),
              J(n),
              it(() => {
                (ae(n, 1, ee(k(g).className)),
                  B(n, 'title', k(g).title),
                  B(n, 'aria-label', k(g).ariaLabel),
                  se(n, k(g).style),
                  B(n, 'data-fs', k(g).fontPx),
                  B(n, 'data-weight', k(g).weight),
                  B(n, 'data-key', k(g).key));
              }),
              D(b, n));
          };
        Rt(h, (b) => {
          k(g).item.href ? b(T) : b(N, -1);
        });
      }
      D(v, S);
    },
  ),
    J(p),
    ta(
      p,
      (v) => (c = v),
      () => c,
    ),
    D(t, p),
    Qe());
}
var Sa =
  yt(`<main class="svelte-1uha8ag"><h1 class="svelte-1uha8ag">openTagCloud</h1> <p class="svelte-1uha8ag">A dependency-free, self-packing tag cloud for any framework — shown here via
    the Svelte 5 component.</p> <div class="box svelte-1uha8ag"><!></div> <h2>Custom sizes &amp; theming</h2> <p class="svelte-1uha8ag">Font range via <code class="svelte-1uha8ag">minPx</code>/<code class="svelte-1uha8ag">maxPx</code>; colors via the <code class="svelte-1uha8ag">--otc-color</code> and <code class="svelte-1uha8ag">--otc-hover-color</code> custom properties.</p> <div class="box themed svelte-1uha8ag"><!></div> <h2>Per-tag color</h2> <p class="svelte-1uha8ag">Give any tag its own <code class="svelte-1uha8ag">color</code> (any CSS color, incl. <code class="svelte-1uha8ag">var(--…)</code>) to highlight or categorize — here green for the most
    popular, red for the least.</p> <div class="box svelte-1uha8ag"><!></div></main>`);
function Pa(t) {
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
    a = e.map((p) => ({
      ...p,
      color: p.weight >= 65 ? '#16a34a' : p.weight <= 25 ? '#dc2626' : void 0,
    }));
  var s = Sa(),
    o = Pt(ot(s), 4),
    l = ot(o);
  (Nt(l, {
    get items() {
      return e;
    },
  }),
    J(o));
  var i = Pt(o, 6),
    c = ot(i);
  (Nt(c, {
    get items() {
      return e;
    },
    minPx: 14,
    maxPx: 56,
  }),
    J(i));
  var f = Pt(i, 6),
    r = ot(f);
  (Nt(r, {
    get items() {
      return a;
    },
  }),
    J(f),
    J(s),
    D(t, s));
}
export { Pa as component };
