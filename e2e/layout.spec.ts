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

const cloudMinHeight = (page: import('@playwright/test').Page) =>
  page.evaluate(
    () => (document.getElementById('cloud') as HTMLElement).style.minHeight,
  );

function overlapping(a: Box, b: Box): boolean {
  // strict interior overlap; touching edges is fine
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function assertNoOverlaps(boxes: Box[]) {
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++)
      expect(
        overlapping(boxes[i], boxes[j]),
        `${boxes[i].key} overlaps ${boxes[j].key}`,
      ).toBe(false);
}

test('packs all tags absolutely positioned with no overlaps', async ({
  page,
}) => {
  await page.goto('/?n=24');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const boxes = await getBoxes(page);
  expect(boxes).toHaveLength(24);
  for (const b of boxes) expect(b.position).toBe('absolute');
  assertNoOverlaps(boxes);
  expect(await cloudMinHeight(page)).toMatch(/^\d+px$/);
});

test('layout is deterministic across reloads', async ({ page }) => {
  await page.goto('/?n=20');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const first = await getBoxes(page);
  await page.reload();
  await page.waitForSelector('.otc-cloud.otc-packed');
  const second = await getBoxes(page);
  expect(second).toEqual(first);
});

test('width change re-packs; height-only change never re-packs (loop-safety invariant)', async ({
  page,
}) => {
  await page.goto('/?n=24');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const before = await getBoxes(page);
  const minHeightBefore = await cloudMinHeight(page);

  // Height-only change: positions may redistribute, but the packed base and the
  // container's own minHeight must not change — that's the anti-feedback-loop rule.
  await page.evaluate(() => (window as any).setBox(600, 500));
  await page.waitForTimeout(150);
  expect(await cloudMinHeight(page)).toBe(minHeightBefore);

  // Width change: must re-pack (some tag ends up at a different x).
  await page.evaluate(() => (window as any).setBox(380, 500));
  await page.waitForTimeout(150);
  const after = await getBoxes(page);
  expect(after.map((b) => b.x)).not.toEqual(before.map((b) => b.x));
  assertNoOverlaps(after);
});

test("fill='height' spreads tags toward the container bottom", async ({
  page,
}) => {
  await page.goto('/?n=16&fill=height');
  await page.waitForSelector('.otc-cloud.otc-packed');
  const packedHeight = parseFloat(await cloudMinHeight(page));
  await page.evaluate(() => (window as any).setBox(600, 500));
  await page.waitForTimeout(150);
  const boxes = await getBoxes(page);
  const lowestEdge = Math.max(...boxes.map((b) => b.y + b.h));
  // tags spread well beyond the packed footprint (up to 4x), within the container
  expect(lowestEdge).toBeGreaterThan(packedHeight + 50);
  expect(lowestEdge).toBeLessThanOrEqual(500);
  assertNoOverlaps(boxes);
});

test('update() re-packs the new item set', async ({ page }) => {
  await page.goto('/?n=24');
  await page.waitForSelector('.otc-cloud.otc-packed');
  await page.evaluate(() =>
    (window as any).cloud.update([
      { label: 'only', weight: 5 },
      { label: 'two', weight: 10 },
    ]),
  );
  const boxes = await getBoxes(page);
  expect(boxes).toHaveLength(2);
  for (const b of boxes) expect(b.position).toBe('absolute');
});
