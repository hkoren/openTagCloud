var Fe = Object.defineProperty;
var ce = (s) => {
  throw TypeError(s);
};
var Ce = (s, e, r) =>
  e in s
    ? Fe(s, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
    : (s[e] = r);
var $ = (s, e, r) => Ce(s, typeof e != 'symbol' ? e + '' : e, r),
  se = (s, e, r) => e.has(s) || ce('Cannot ' + r);
var t = (s, e, r) => (
    se(s, e, 'read from private field'),
    r ? r.call(s) : e.get(s)
  ),
  d = (s, e, r) =>
    e.has(s)
      ? ce('Cannot add the same private member more than once')
      : e instanceof WeakSet
        ? e.add(s)
        : e.set(s, r),
  a = (s, e, r, i) => (
    se(s, e, 'write to private field'),
    i ? i.call(s, r) : e.set(s, r),
    r
  ),
  _ = (s, e, r) => (se(s, e, 'access private method'), r);
import {
  a2 as Ie,
  G as Ee,
  C as He,
  a3 as Te,
  g as Me,
  a4 as G,
  a5 as _e,
  e as C,
  h as I,
  D as x,
  a6 as ue,
  i as Ye,
  w as xe,
  a7 as Pe,
  a8 as pe,
  b as O,
  c as we,
  p as re,
  a as F,
  m as Ve,
  a9 as qe,
  aa as K,
  ab as Q,
  ac as ge,
  ad as Be,
  ae as Le,
  af as Se,
  f as ke,
  ag as $e,
  d as ie,
  z as Z,
  ah as je,
  y as ze,
  ai as j,
  E as We,
  aj as Xe,
  ak as Ge,
  al as Je,
  am as Ue,
  an as ne,
  X as Ke,
  ao as Re,
  ap as Qe,
  aq as Ze,
  ar as ae,
  A as z,
  as as et,
  at as tt,
  au as st,
  av as rt,
  k as it,
  aw as nt,
  ax as at,
  n as ft,
  ay as ve,
} from './Dhq6kDMD.js';
import { b as ht } from './CFiLYvC6.js';
function ot(s) {
  let e = 0,
    r = Te(0),
    i;
  return () => {
    Ie() &&
      (Ee(r),
      He(
        () => (
          e === 0 && (i = Me(() => s(() => _e(r)))),
          (e += 1),
          () => {
            G(() => {
              ((e -= 1), e === 0 && (i == null || i(), (i = void 0), _e(r)));
            });
          }
        ),
      ));
  };
}
var lt = We | Xe;
function dt(s, e, r, i) {
  new ct(s, e, r, i);
}
var E,
  q,
  w,
  H,
  v,
  S,
  p,
  T,
  k,
  M,
  D,
  P,
  B,
  L,
  R,
  ee,
  h,
  Ae,
  De,
  Ne,
  fe,
  J,
  U,
  he,
  oe;
class ct {
  constructor(e, r, i, o) {
    d(this, h);
    $(this, 'parent');
    $(this, 'is_pending', !1);
    $(this, 'transform_error');
    d(this, E);
    d(this, q, I ? C : null);
    d(this, w);
    d(this, H);
    d(this, v);
    d(this, S, null);
    d(this, p, null);
    d(this, T, null);
    d(this, k, null);
    d(this, M, 0);
    d(this, D, 0);
    d(this, P, !1);
    d(this, B, new Set());
    d(this, L, new Set());
    d(this, R, null);
    d(
      this,
      ee,
      ot(
        () => (
          a(this, R, Te(t(this, M))),
          () => {
            a(this, R, null);
          }
        ),
      ),
    );
    var n;
    (a(this, E, e),
      a(this, w, r),
      a(this, H, (f) => {
        var g = x;
        ((g.b = this), (g.f |= ue), i(f));
      }),
      (this.parent = x.b),
      (this.transform_error =
        o ??
        ((n = this.parent) == null ? void 0 : n.transform_error) ??
        ((f) => f)),
      a(
        this,
        v,
        Ye(() => {
          if (I) {
            const f = t(this, q);
            xe();
            const g = f.data === Pe;
            if (f.data.startsWith(pe)) {
              const c = JSON.parse(f.data.slice(pe.length));
              _(this, h, De).call(this, c);
            } else g ? _(this, h, Ne).call(this) : _(this, h, Ae).call(this);
          } else _(this, h, fe).call(this);
        }, lt),
      ),
      I && a(this, E, C));
  }
  defer_effect(e) {
    qe(e, t(this, B), t(this, L));
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!t(this, w).pending;
  }
  update_pending_count(e, r) {
    (_(this, h, he).call(this, e, r),
      a(this, M, t(this, M) + e),
      !(!t(this, R) || t(this, P)) &&
        (a(this, P, !0),
        G(() => {
          (a(this, P, !1), t(this, R) && $e(t(this, R), t(this, M)));
        })));
  }
  get_effect_pending() {
    return (t(this, ee).call(this), Ee(t(this, R)));
  }
  error(e) {
    var r;
    if (!t(this, w).onerror && !t(this, w).failed) throw e;
    (r = F) != null && r.is_fork
      ? (t(this, S) && F.skip_effect(t(this, S)),
        t(this, p) && F.skip_effect(t(this, p)),
        t(this, T) && F.skip_effect(t(this, T)),
        F.oncommit(() => {
          _(this, h, oe).call(this, e);
        }))
      : _(this, h, oe).call(this, e);
  }
}
((E = new WeakMap()),
  (q = new WeakMap()),
  (w = new WeakMap()),
  (H = new WeakMap()),
  (v = new WeakMap()),
  (S = new WeakMap()),
  (p = new WeakMap()),
  (T = new WeakMap()),
  (k = new WeakMap()),
  (M = new WeakMap()),
  (D = new WeakMap()),
  (P = new WeakMap()),
  (B = new WeakMap()),
  (L = new WeakMap()),
  (R = new WeakMap()),
  (ee = new WeakMap()),
  (h = new WeakSet()),
  (Ae = function () {
    try {
      a(
        this,
        S,
        O(() => t(this, H).call(this, t(this, E))),
      );
    } catch (e) {
      this.error(e);
    }
  }),
  (De = function (e) {
    const r = t(this, w).failed;
    r &&
      a(
        this,
        T,
        O(() => {
          r(
            t(this, E),
            () => e,
            () => () => {},
          );
        }),
      );
  }),
  (Ne = function () {
    const e = t(this, w).pending;
    e &&
      ((this.is_pending = !0),
      a(
        this,
        p,
        O(() => e(t(this, E))),
      ),
      G(() => {
        var r = a(this, k, document.createDocumentFragment()),
          i = we();
        (r.append(i),
          a(
            this,
            S,
            _(this, h, U).call(this, () => O(() => t(this, H).call(this, i))),
          ),
          t(this, D) === 0 &&
            (t(this, E).before(r),
            a(this, k, null),
            re(t(this, p), () => {
              a(this, p, null);
            }),
            _(this, h, J).call(this, F)));
      }));
  }),
  (fe = function () {
    try {
      if (
        ((this.is_pending = this.has_pending_snippet()),
        a(this, D, 0),
        a(this, M, 0),
        a(
          this,
          S,
          O(() => {
            t(this, H).call(this, t(this, E));
          }),
        ),
        t(this, D) > 0)
      ) {
        var e = a(this, k, document.createDocumentFragment());
        Ve(t(this, S), e);
        const r = t(this, w).pending;
        a(
          this,
          p,
          O(() => r(t(this, E))),
        );
      } else _(this, h, J).call(this, F);
    } catch (r) {
      this.error(r);
    }
  }),
  (J = function (e) {
    ((this.is_pending = !1), e.transfer_effects(t(this, B), t(this, L)));
  }),
  (U = function (e) {
    var r = x,
      i = Se,
      o = ke;
    (K(t(this, v)), Q(t(this, v)), ge(t(this, v).ctx));
    try {
      return (Be.ensure(), e());
    } catch (n) {
      return (Le(n), null);
    } finally {
      (K(r), Q(i), ge(o));
    }
  }),
  (he = function (e, r) {
    var i;
    if (!this.has_pending_snippet()) {
      this.parent && _((i = this.parent), h, he).call(i, e, r);
      return;
    }
    (a(this, D, t(this, D) + e),
      t(this, D) === 0 &&
        (_(this, h, J).call(this, r),
        t(this, p) &&
          re(t(this, p), () => {
            a(this, p, null);
          }),
        t(this, k) && (t(this, E).before(t(this, k)), a(this, k, null))));
  }),
  (oe = function (e) {
    (t(this, S) && (ie(t(this, S)), a(this, S, null)),
      t(this, p) && (ie(t(this, p)), a(this, p, null)),
      t(this, T) && (ie(t(this, T)), a(this, T, null)),
      I && (Z(t(this, q)), je(), Z(ze())));
    var r = t(this, w).onerror;
    let i = t(this, w).failed;
    var o = !1,
      n = !1;
    const f = () => {
        if (o) {
          Je();
          return;
        }
        ((o = !0),
          n && Ge(),
          t(this, T) !== null &&
            re(t(this, T), () => {
              a(this, T, null);
            }),
          _(this, h, U).call(this, () => {
            _(this, h, fe).call(this);
          }));
      },
      g = (l) => {
        try {
          ((n = !0), r == null || r(l, f), (n = !1));
        } catch (c) {
          j(c, t(this, v) && t(this, v).parent);
        }
        i &&
          a(
            this,
            T,
            _(this, h, U).call(this, () => {
              try {
                return O(() => {
                  var c = x;
                  ((c.b = this),
                    (c.f |= ue),
                    i(
                      t(this, E),
                      () => l,
                      () => f,
                    ));
                });
              } catch (c) {
                return (j(c, t(this, v).parent), null);
              }
            }),
          );
      };
    G(() => {
      var l;
      try {
        l = this.transform_error(e);
      } catch (c) {
        j(c, t(this, v) && t(this, v).parent);
        return;
      }
      l !== null && typeof l == 'object' && typeof l.then == 'function'
        ? l.then(g, (c) => j(c, t(this, v) && t(this, v).parent))
        : g(l);
    });
  }));
const _t = ['touchstart', 'touchmove'];
function ut(s) {
  return _t.includes(s);
}
const W = Symbol('events'),
  pt = new Set(),
  ye = new Set();
let me = null;
function be(s) {
  var b, N;
  var e = this,
    r = e.ownerDocument,
    i = s.type,
    o = ((b = s.composedPath) == null ? void 0 : b.call(s)) || [],
    n = o[0] || s.target;
  me = s;
  var f = 0,
    g = me === s && s[W];
  if (g) {
    var l = o.indexOf(g);
    if (l !== -1 && (e === document || e === window)) {
      s[W] = e;
      return;
    }
    var c = o.indexOf(e);
    if (c === -1) return;
    l <= c && (f = l);
  }
  if (((n = o[f] || s.target), n !== e)) {
    Ue(s, 'currentTarget', {
      configurable: !0,
      get() {
        return n || r;
      },
    });
    var Y = Se,
      V = x;
    (Q(null), K(null));
    try {
      for (var A, y = []; n !== null && n !== e;) {
        try {
          var m = (N = n[W]) == null ? void 0 : N[i];
          m != null && (!n.disabled || s.target === n) && m.call(n, s);
        } catch (u) {
          A ? y.push(u) : (A = u);
        }
        if (s.cancelBubble) break;
        (f++, (n = f < o.length ? o[f] : null));
      }
      if (A) {
        for (let u of y)
          queueMicrotask(() => {
            throw u;
          });
        throw A;
      }
    } finally {
      ((s[W] = e), delete s.currentTarget, Q(Y), K(V));
    }
  }
}
function bt(s, e) {
  var i;
  var r = e == null ? '' : typeof e == 'object' ? `${e}` : e;
  r !== (s[(i = ve)] ?? (s[i] = s.nodeValue)) &&
    ((s[ve] = r), (s.nodeValue = `${r}`));
}
function gt(s, e) {
  return Oe(s, e);
}
function Et(s, e) {
  (ne(), (e.intro = e.intro ?? !1));
  const r = e.target,
    i = I,
    o = C;
  try {
    for (var n = Ke(r); n && (n.nodeType !== Re || n.data !== Qe);) n = Ze(n);
    if (!n) throw ae;
    (z(!0), Z(n));
    const f = Oe(s, { ...e, anchor: n });
    return (z(!1), f);
  } catch (f) {
    if (
      f instanceof Error &&
      f.message
        .split(
          `
`,
        )
        .some((g) => g.startsWith('https://svelte.dev/e/'))
    )
      throw f;
    return (
      f !== ae && console.warn('Failed to hydrate: ', f),
      e.recover === !1 && et(),
      ne(),
      tt(r),
      z(!1),
      gt(s, e)
    );
  } finally {
    (z(i), Z(o));
  }
}
const X = new Map();
function Oe(
  s,
  {
    target: e,
    anchor: r,
    props: i = {},
    events: o,
    context: n,
    intro: f = !0,
    transformError: g,
  },
) {
  ne();
  var l = void 0,
    c = st(() => {
      var Y = r ?? e.appendChild(we());
      dt(
        Y,
        { pending: () => {} },
        (y) => {
          it({});
          var m = ke;
          if (
            (n && (m.c = n),
            o && (i.$$events = o),
            I && ht(y, null),
            (l = s(y, i) || {}),
            I &&
              ((x.nodes.end = C),
              C === null || C.nodeType !== Re || C.data !== nt))
          )
            throw (at(), ae);
          ft();
        },
        g,
      );
      var V = new Set(),
        A = (y) => {
          for (var m = 0; m < y.length; m++) {
            var b = y[m];
            if (!V.has(b)) {
              V.add(b);
              var N = ut(b);
              for (const te of [e, document]) {
                var u = X.get(te);
                u === void 0 && ((u = new Map()), X.set(te, u));
                var de = u.get(b);
                de === void 0
                  ? (te.addEventListener(b, be, { passive: N }), u.set(b, 1))
                  : u.set(b, de + 1);
              }
            }
          }
        };
      return (
        A(rt(pt)),
        ye.add(A),
        () => {
          var N;
          for (var y of V)
            for (const u of [e, document]) {
              var m = X.get(u),
                b = m.get(y);
              --b == 0
                ? (u.removeEventListener(y, be),
                  m.delete(y),
                  m.size === 0 && X.delete(u))
                : m.set(y, b);
            }
          (ye.delete(A),
            Y !== r && ((N = Y.parentNode) == null || N.removeChild(Y)));
        }
      );
    });
  return (le.set(l, c), l);
}
let le = new WeakMap();
function Tt(s, e) {
  const r = le.get(s);
  return r ? (le.delete(s), r(e)) : Promise.resolve();
}
export { Et as h, gt as m, bt as s, Tt as u };
