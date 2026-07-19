// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { injectStyles, TAG_CLOUD_CSS } from '../src/index.js';

describe('injectStyles', () => {
  it('injects the stylesheet once and is idempotent', () => {
    expect(document.getElementById('opentagcloud-css')).toBeNull();
    injectStyles();
    const el = document.getElementById('opentagcloud-css');
    expect(el?.tagName).toBe('STYLE');
    expect(el?.textContent).toBe(TAG_CLOUD_CSS);
    injectStyles();
    expect(document.querySelectorAll('#opentagcloud-css')).toHaveLength(1);
  });

  it('includes the no-wrap rule (#2) and reduced-motion guard (#4)', () => {
    expect(TAG_CLOUD_CSS).toContain('.otc-tag .otc-nb');
    expect(TAG_CLOUD_CSS).toContain('prefers-reduced-motion: no-preference');
  });
});
