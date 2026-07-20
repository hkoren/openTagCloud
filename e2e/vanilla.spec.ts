import { expect, test } from '@playwright/test';

// Exercises the script-tag (UMD) build end-to-end: global API, mount(),
// and the <otc-tag-cloud> custom element with fill='height'.
test('UMD build exposes the API, mounts, and registers <otc-tag-cloud>', async ({
  page,
}) => {
  await page.goto('/e2e/fixture-vanilla.html');
  await page.waitForSelector('#mount-box .otc-cloud.otc-packed');
  await page.waitForSelector('otc-tag-cloud .otc-cloud.otc-packed');

  const state = await page.evaluate(() => {
    const g = (window as any).openTagCloud;
    const mountRoot = document.querySelector('#mount-box .otc-cloud')!;
    const el = document.getElementById('element')!;
    const elTags = [...el.querySelectorAll<HTMLElement>('.otc-tag')];
    return {
      api: [
        typeof g.mount,
        typeof g.defineElement,
        typeof g.renderTagCloud,
        typeof g.prepareTags,
      ],
      mountTags: mountRoot.querySelectorAll('.otc-tag').length,
      mountAnchor: !!mountRoot.querySelector('a.otc-tag[href="#js"]'),
      elTags: elTags.length,
      elPackedHeight: parseFloat(
        (el.querySelector('.otc-cloud') as HTMLElement).style.minHeight,
      ),
      elLowest: Math.max(...elTags.map((t) => t.offsetTop + t.offsetHeight)),
      colored: elTags.some(
        (t) => t.style.getPropertyValue('--otc-tag-color') === 'tomato',
      ),
    };
  });

  expect(state.api).toEqual(['function', 'function', 'function', 'function']);
  expect(state.mountTags).toBe(4);
  expect(state.mountAnchor).toBe(true);
  expect(state.elTags).toBe(6);
  expect(state.colored).toBe(true);
  // fit mode (#16) packs to the element's height; tags reach near the bottom
  expect(state.elPackedHeight).toBeGreaterThan(260 * 0.6);
  expect(state.elLowest).toBeGreaterThan(260 * 0.7);
  expect(state.elLowest).toBeLessThanOrEqual(260 * 1.15);

  // items property update re-renders in place
  const afterUpdate = await page.evaluate(() => {
    const el = document.getElementById('element') as any;
    el.items = [
      { label: 'One', weight: 5 },
      { label: 'Two', weight: 9 },
    ];
    return el.querySelectorAll('.otc-tag').length;
  });
  expect(afterUpdate).toBe(2);

  // mount() handle: update + destroy
  const handleState = await page.evaluate(() => {
    const cloud = (window as any).cloud;
    cloud.update([{ label: 'Solo', weight: 1 }]);
    const afterUpdate = document.querySelectorAll('#mount-box .otc-tag').length;
    cloud.destroy();
    const afterDestroy =
      document.getElementById('mount-box')!.childElementCount;
    return { afterUpdate, afterDestroy };
  });
  expect(handleState).toEqual({ afterUpdate: 1, afterDestroy: 0 });
});
