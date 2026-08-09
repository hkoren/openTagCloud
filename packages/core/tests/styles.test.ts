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

  it('styles button tags to look identical to spans (#39)', () => {
    expect(TAG_CLOUD_CSS).toContain('button.otc-tag');
    // line-height must be restated: the `font` shorthand would reset it and
    // change measured tag height, altering the packed layout
    expect(TAG_CLOUD_CSS).toMatch(
      /button\.otc-tag\s*\{[^}]*line-height:\s*0\.95/,
    );
    // font properties are set individually (the shorthand would reset
    // line-height); asserted positively, since a negative match on "font:"
    // also hits the explanatory comment
    expect(TAG_CLOUD_CSS).toMatch(
      /button\.otc-tag\s*\{[^}]*font-family:\s*inherit/,
    );
    // and hover/focus applies to buttons as well as anchors
    expect(TAG_CLOUD_CSS).toContain('button.otc-tag:focus-visible');
  });

  it('includes the no-wrap rule (#2) and reduced-motion guard (#4)', () => {
    expect(TAG_CLOUD_CSS).toContain('.otc-tag .otc-nb');
    expect(TAG_CLOUD_CSS).toContain('prefers-reduced-motion: no-preference');
  });
});
