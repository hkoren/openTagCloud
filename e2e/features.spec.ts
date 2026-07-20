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
  await page.goto('/?n=24');
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
