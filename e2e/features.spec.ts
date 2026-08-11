import { expect, test } from '@playwright/test';

interface Box {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  position: string;
}

const getBoxes = (page: import('@playwright/test').Page) =>
  page.evaluate(() => (window as any).boxes() as Box[]);

function countOverlaps(boxes: Box[]): number {
  let bad = 0;
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      if (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
      )
        bad++;
    }
  return bad;
}

test('estimateCloudHeight approximates the real packed height (#5)', async ({
  page,
}) => {
  // auto-height container: the estimate exists to reserve space where the
  // packer uses area-based height (fixed-height boxes need no reservation)
  await page.goto('/?n=24&auto');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const { actual, estimate } = await page.evaluate(() => {
    const cloud = document.getElementById('cloud') as HTMLElement;
    return {
      actual: parseFloat(cloud.style.minHeight),
      estimate: (window as any).estimate(cloud.clientWidth) as number,
    };
  });
  expect(estimate).toBeGreaterThan(0);
  // heuristic text metrics: assert the estimate is the right order of
  // magnitude, which is what CLS reservation needs
  expect(estimate).toBeGreaterThan(actual * 0.4);
  expect(estimate).toBeLessThan(actual * 2.5);
});

test('re-packs FLIP-animate moved tags and scale-in new ones (#6)', async ({
  page,
}) => {
  await page.goto('/?n=16');
  await page.waitForSelector('.otc-cloud.otc-packed');
  // trigger an update and inspect computed transforms in the same task —
  // the FLIP transition is running, so they are mid-interpolation matrices
  const during = await page.evaluate(() => {
    (window as any).addOne();
    return [...document.querySelectorAll<HTMLElement>('.otc-tag')].map(
      (el) => getComputedStyle(el).transform,
    );
  });
  expect(during.some((t) => t !== 'none')).toBe(true);
  // and they settle back to identity
  await page.waitForTimeout(500);
  const after = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('.otc-tag')].map(
      (el) => getComputedStyle(el).transform,
    ),
  );
  expect(after.every((t) => t === 'none')).toBe(true);
});

test('prefers-reduced-motion disables the FLIP animation (#6)', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?n=16');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const during = await page.evaluate(() => {
    (window as any).addOne();
    return [...document.querySelectorAll<HTMLElement>('.otc-tag')].map(
      (el) => getComputedStyle(el).transform,
    );
  });
  expect(during.every((t) => t === 'none')).toBe(true);
});

test('--otc-move-transition: 0s disables the FLIP animation (#6)', async ({
  page,
}) => {
  await page.goto('/?n=16');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const during = await page.evaluate(() => {
    document
      .getElementById('cloud')!
      .style.setProperty('--otc-move-transition', '0s');
    (window as any).addOne();
    return [...document.querySelectorAll<HTMLElement>('.otc-tag')].map(
      (el) => getComputedStyle(el).transform,
    );
  });
  expect(during.every((t) => t === 'none')).toBe(true);
});

test('incremental refresh keeps unchanged tags in place (#7)', async ({
  page,
}) => {
  await page.goto('/?n=30&incremental');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const before = await getBoxes(page);

  await page.evaluate(() => (window as any).addOne());
  await page.waitForTimeout(400); // let the FLIP settle before measuring
  const after = await getBoxes(page);

  expect(after).toHaveLength(31);
  expect(countOverlaps(after)).toBe(0);
  expect(after.find((b) => b.key === 'newcomer')).toBeTruthy();

  const afterByKey = new Map(after.map((b) => [b.key, b]));
  const kept = before.filter((b) => {
    const now = afterByKey.get(b.key);
    return now && Math.abs(now.x - b.x) <= 1 && Math.abs(now.y - b.y) <= 1;
  });
  // the vast majority of existing tags must not move
  expect(kept.length).toBeGreaterThanOrEqual(Math.floor(before.length * 0.8));
});

test('non-incremental refresh reshuffles (control for #7)', async ({
  page,
}) => {
  await page.goto('/?n=30');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const before = await getBoxes(page);
  await page.evaluate(() => (window as any).addOne());
  await page.waitForTimeout(400);
  const after = await getBoxes(page);
  const afterByKey = new Map(after.map((b) => [b.key, b]));
  const kept = before.filter((b) => {
    const now = afterByKey.get(b.key);
    return now && Math.abs(now.x - b.x) <= 1 && Math.abs(now.y - b.y) <= 1;
  });
  // full re-pack re-ranks anchors, so most tags move — this guards that the
  // incremental assertion above is actually meaningful
  expect(kept.length).toBeLessThan(before.length * 0.8);
});

test('fit mode fills an externally sized container with larger type (#16)', async ({
  page,
}) => {
  // density=0 (even distribution) is the setting this guarantee is about:
  // clustering deliberately trades container fill for a tighter cloud, so at
  // the default 0.5 the box is intentionally not filled edge to edge (#51).
  await page.goto('/?n=24&density=0');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const { packH, boxH, avgFont } = await page.evaluate(() => {
    const cloud = document.getElementById('cloud') as HTMLElement;
    const fonts = [...document.querySelectorAll<HTMLElement>('.otc-tag')].map(
      (el) => parseFloat(getComputedStyle(el).fontSize),
    );
    return {
      packH: parseFloat(cloud.style.minHeight),
      boxH: document.getElementById('box')!.clientHeight,
      avgFont: fonts.reduce((a, b) => a + b, 0) / fonts.length,
    };
  });
  // the packed cloud fills most of the 300px box without overflowing far
  expect(packH).toBeGreaterThan(boxH * 0.6);
  expect(packH).toBeLessThan(boxH * 1.15);
  // and fonts scaled up beyond the base ramp to do it
  expect(avgFont).toBeGreaterThan(18);
  const boxes = await getBoxes(page);
  expect(countOverlaps(boxes)).toBe(0);
});

test('auto-height containers keep area-based packing — no feedback loop (#16)', async ({
  page,
}) => {
  await page.goto('/?n=24&auto');
  await page.waitForSelector('.otc-cloud.otc-packed');
  // stable across settle time: minHeight must not creep (the loop guard)
  const h1 = await page.evaluate(() =>
    parseFloat(
      (document.getElementById('cloud') as HTMLElement).style.minHeight,
    ),
  );
  await page.waitForTimeout(300);
  const h2 = await page.evaluate(() =>
    parseFloat(
      (document.getElementById('cloud') as HTMLElement).style.minHeight,
    ),
  );
  expect(h1).toBeGreaterThan(0);
  expect(h2).toBe(h1);
  expect(countOverlaps(await getBoxes(page))).toBe(0);
});

test('RTL documents mirror the layout via logical positioning (#11)', async ({
  page,
}) => {
  await page.goto('/?n=12');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const ltr = await getBoxes(page);
  const W = await page.evaluate(
    () => document.getElementById('cloud')!.clientWidth,
  );

  await page.goto('/?n=12&dir=rtl');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const rtl = await getBoxes(page);
  expect(countOverlaps(rtl)).toBe(0);

  const rtlByKey = new Map(rtl.map((b) => [b.key, b]));
  for (const b of ltr) {
    const m = rtlByKey.get(b.key)!;
    expect(m, `missing ${b.key}`).toBeTruthy();
    // physical x mirrors: x_rtl = W - x_ltr - w (±2px rounding)
    expect(Math.abs(m.x - (W - b.x - b.w))).toBeLessThanOrEqual(2);
    expect(Math.abs(m.y - b.y)).toBeLessThanOrEqual(2);
  }
});

test('long nowrap labels never overflow their measured boxes at fit scale (#16 regression)', async ({
  page,
}) => {
  await page.goto('/?n=14&long');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const boxes = await getBoxes(page);
  expect(countOverlaps(boxes)).toBe(0);
  // and the rendered glyphs stay inside the measured box (no clamped overflow)
  const overflowing = await page.evaluate(
    () =>
      [...document.querySelectorAll<HTMLElement>('.otc-tag')].filter(
        (el) => el.scrollWidth > el.clientWidth + 1,
      ).length,
  );
  expect(overflowing).toBe(0);
});

test('fit mode never shrinks type below the base ramp — crowded boxes overflow legibly (#16 rework)', async ({
  page,
}) => {
  // 80 tags cannot fit a 600x250 box at base size; pre-rework this crammed
  // them at ~half size. Now every tag keeps >= its base ramp size and the
  // cloud overflows (minHeight grows past the box) like it did before #16.
  await page.goto('/?n=80');
  await page.evaluate(() => (window as any).setBox(600, 250));
  await page.waitForSelector('.otc-cloud.otc-packed');
  await page.waitForTimeout(200);
  const { shrunk, minH } = await page.evaluate(() => {
    const cloud = document.getElementById('cloud') as HTMLElement;
    const W = cloud.clientWidth;
    const widthFactor = Math.min(1.25, Math.max(0.72, W / 460));
    const tags = [...document.querySelectorAll<HTMLElement>('.otc-tag')];
    return {
      shrunk: tags.filter((el) => {
        const base = Math.max(
          8,
          parseFloat(el.dataset.fs || '12') * widthFactor,
        );
        return parseFloat(getComputedStyle(el).fontSize) < base - 0.2;
      }).length,
      minH: parseFloat(cloud.style.minHeight),
    };
  });
  expect(shrunk).toBe(0); // no tag below its base ramp size
  expect(minH).toBeGreaterThan(250); // overflowed instead of cramming
});

test('unsafe tag data cannot inject script URLs or CSS declarations (#35, #36)', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.goto('/?n=6&unsafe');
  await page.waitForSelector('.otc-cloud.otc-packed');
  await page.waitForTimeout(300);

  const state = await page.evaluate(() => {
    const byKey = (k: string) =>
      document.querySelector(`.otc-tag[data-key="${k}"]`) as HTMLElement | null;
    const evil = byKey('evil');
    const leak = byKey('leak');
    return {
      // the javascript: tag must not be a link at all
      evilTagName: evil?.tagName,
      evilHasHref: evil?.hasAttribute('href') ?? null,
      // the injected declaration must never reach the element
      leakStyle: leak?.getAttribute('style') ?? '',
      leakBackground: leak ? getComputedStyle(leak).backgroundImage : '',
      leakColorVar: leak
        ? getComputedStyle(leak).getPropertyValue('--otc-tag-color').trim()
        : '',
    };
  });

  expect(state.evilTagName).toBe('SPAN');
  expect(state.evilHasHref).toBe(false);
  expect(state.leakStyle).not.toContain('background');
  expect(state.leakBackground).toBe('none');
  // the whole color is rejected rather than partially applied
  expect(state.leakColorVar).toBe('');
  // and nothing phoned home
  expect(requests.filter((u) => u.includes('__exfil'))).toEqual([]);
});

test('interactive tags are keyboard-operable buttons and pack like spans (#39)', async ({
  page,
}) => {
  await page.goto('/?n=20');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const spanBoxes = await getBoxes(page);

  await page.goto('/?n=20&click');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const buttonBoxes = await getBoxes(page);

  const kinds = await page.evaluate(() => ({
    buttons: document.querySelectorAll('button.otc-tag').length,
    anchors: document.querySelectorAll('a.otc-tag').length,
  }));
  expect(kinds).toEqual({ buttons: 20, anchors: 0 });

  // the layout engine keys off .otc-tag, so the element swap must not move
  // anything: identical geometry to the span layout
  expect(buttonBoxes.map((b) => [b.x, b.y])).toEqual(
    spanBoxes.map((b) => [b.x, b.y]),
  );
  expect(countOverlaps(buttonBoxes)).toBe(0);

  // buttons are reachable and activatable by keyboard alone
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    key: (document.activeElement as HTMLElement)?.dataset?.key,
  }));
  expect(focused.tag).toBe('BUTTON');
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => (window as any).clicks)).toEqual([
    focused.key,
  ]);
});

test('density changes the arrangement deterministically, never overlapping (#51)', async ({
  page,
}) => {
  // What is asserted here is deliberately non-directional. Density contracts the
  // anchor grid toward the centre, but no single rendered number tracks that
  // monotonically across container shapes, because other parts of the layout
  // compensate:
  //   - in a sized container, fit mode scales fonts up until the cloud fills
  //     the box, so bounding-box area stays ~0.93-1.0 of the container at every
  //     density;
  //   - the elliptical growth front spreads a tight cluster across the width;
  //   - mean radius from the centre is non-monotonic (measured 155, 143, 134,
  //     129, 134 for density 0..1) — an early version of this test asserted it
  //     and failed in CI while passing locally.
  // The tightening is real and visible (ink/bounding-box rose 0.283 -> 0.397
  // across density 0 -> 1 in a 600x300 box), but it is not a stable single
  // metric, so this test pins the properties that must always hold instead.
  const layoutAt = async (density?: number) => {
    const q = density === undefined ? '' : `&density=${density}`;
    await page.goto(`/?n=40&auto${q}`);
    await page.waitForSelector('.otc-cloud.otc-packed');
    await page.waitForTimeout(150);
    const boxes = await getBoxes(page);
    expect(countOverlaps(boxes), `overlaps at density=${density}`).toBe(0);
    return boxes.map((b) => `${b.key}:${b.x},${b.y}`).join('|');
  };

  const loose = await layoutAt(0);
  const middle = await layoutAt(0.5);
  const tight = await layoutAt(1);

  // Directional check: density also tightens the gap between boxes, so the
  // cloud's own bounding box holds proportionally more ink as density rises.
  // (Measured across container widths and word counts: ~0.23 -> ~0.35.)
  const fillAt = async (density: number) => {
    await page.goto(`/?n=30&auto&density=${density}`);
    await page.waitForSelector('.otc-cloud.otc-packed');
    await page.waitForTimeout(150);
    const boxes = await getBoxes(page);
    const w =
      Math.max(...boxes.map((b) => b.x + b.w)) -
      Math.min(...boxes.map((b) => b.x));
    const h =
      Math.max(...boxes.map((b) => b.y + b.h)) -
      Math.min(...boxes.map((b) => b.y));
    const ink = boxes.reduce((s, b) => s + b.w * b.h, 0);
    return ink / (w * h);
  };
  const looseFill = await fillAt(0);
  const tightFill = await fillAt(1);
  expect(tightFill).toBeGreaterThan(looseFill * 1.1);

  // density demonstrably changes the arrangement, end to end through the DOM
  expect(loose).not.toBe(middle);
  expect(middle).not.toBe(tight);
  expect(loose).not.toBe(tight);

  // the default is exactly 0.5, and out-of-range values clamp rather than drift
  expect(await layoutAt(undefined)).toBe(middle);
  expect(await layoutAt(5)).toBe(tight);
  expect(await layoutAt(-2)).toBe(loose);
});

test("the cloud takes its container's aspect ratio, not a circle (#51 follow-up)", async ({
  page,
}) => {
  // Before the spiral was made elliptical, a 3.6:1 container produced a cloud
  // of aspect ~1.25 — a circle floating in a wide box. The growth front is now
  // stretched to the box aspect, so the cloud resembles its container.
  const aspectIn = async (w: number, h: number) => {
    await page.goto('/?n=40&density=1');
    await page.waitForSelector('.otc-cloud.otc-packed');
    await page.evaluate(([w, h]) => (window as any).setBox(w, h), [w, h]);
    await page.waitForTimeout(300);
    const boxes = await getBoxes(page);
    expect(countOverlaps(boxes), `overlaps in ${w}x${h}`).toBe(0);
    const span = (get: (b: Box) => [number, number]) => {
      const lo = Math.min(...boxes.map((b) => get(b)[0]));
      const hi = Math.max(...boxes.map((b) => get(b)[1]));
      return hi - lo;
    };
    return span((b) => [b.x, b.x + b.w]) / span((b) => [b.y, b.y + b.h]);
  };

  const wide = await aspectIn(900, 250); // container aspect 3.6
  const square = await aspectIn(500, 500); // 1.0
  const tall = await aspectIn(300, 600); // 0.5

  // each cloud is far from circular where its container is, and ordered
  expect(wide).toBeGreaterThan(2);
  expect(tall).toBeLessThan(1);
  expect(wide).toBeGreaterThan(square);
  expect(square).toBeGreaterThan(tall);
});

test('fillFactor controls negative space, and re-enables density (#58)', async ({
  page,
}) => {
  // A sized container: this is where the font scaling operates.
  const stats = async (query: string) => {
    await page.goto(`/?n=24&${query}`);
    await page.waitForSelector('.otc-cloud.otc-packed');
    await page.waitForTimeout(150);
    return page.evaluate(() => {
      const box = document.getElementById('box')!;
      const tags = [...document.querySelectorAll<HTMLElement>('.otc-tag')];
      const fonts = tags.map((t) => parseFloat(getComputedStyle(t).fontSize));
      const ink = tags.reduce((s, t) => s + t.offsetWidth * t.offsetHeight, 0);
      return {
        avgFont: +(fonts.reduce((a, b) => a + b, 0) / fonts.length).toFixed(1),
        inkOfBox: +(ink / (box.clientWidth * box.clientHeight)).toFixed(3),
      };
    });
  };

  const full = await stats('fillFactor=1');
  const mid = await stats('fillFactor=0.75');
  const sparse = await stats('fillFactor=0');

  // More fill → bigger type and more of the container covered.
  expect(full.avgFont).toBeGreaterThan(mid.avgFont);
  expect(mid.avgFont).toBeGreaterThan(sparse.avgFont);
  expect(full.inkOfBox).toBeGreaterThan(sparse.inkOfBox);

  // At 0 the type collapses to the authored ramp — the layout stops growing it.
  const baseRamp = await page.evaluate(() => {
    const tags = [...document.querySelectorAll<HTMLElement>('.otc-tag')];
    const cloud = document.getElementById('cloud')!;
    const wf = Math.min(1.25, Math.max(0.72, cloud.clientWidth / 460));
    return tags.every((t) => {
      const base = Math.max(8, parseFloat(t.dataset.fs || '12') * wf);
      return parseFloat(getComputedStyle(t).fontSize) <= base + 0.2;
    });
  });
  expect(baseRamp).toBe(true);

  // The point of the setting (#58): with room to spare, density is legible
  // again, because the font growth is no longer absorbing what it frees up.
  const inkAt = async (density: number) =>
    (await stats(`fillFactor=0.6&density=${density}`)).inkOfBox;
  expect(await inkAt(1)).toBeGreaterThan((await inkAt(0)) * 1.05);
});
