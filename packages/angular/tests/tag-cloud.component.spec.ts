import { TestBed, type ComponentFixture } from '@angular/core/testing';
import type { TagCloudItem } from '@opentagcloud/core';
import { TagCloudComponent } from '../src/tag-cloud.component';

const items: TagCloudItem[] = [
  { label: 'JavaScript', weight: 95, href: '/js' },
  { label: 'Rust', weight: 60 },
  { label: 'Go', weight: 55, color: 'tomato', class: 'hot' },
];

describe('TagCloudComponent (angular)', () => {
  let fixture: ComponentFixture<TagCloudComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagCloudComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TagCloudComponent);
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  it('uses the host element as the cloud container', () => {
    expect(host.classList.contains('otc-cloud')).toBe(true);
  });

  it('renders one element per item with the layout-engine contract attributes', () => {
    const tags = host.querySelectorAll('.otc-tag');
    expect(tags).toHaveLength(3);
    tags.forEach((tag) => {
      expect(tag.getAttribute('data-fs')).toMatch(/^\d/);
      expect(tag.getAttribute('data-weight')).toMatch(/^\d/);
      expect(tag.getAttribute('data-key')).toBeTruthy();
      expect(tag.getAttribute('title')).toBeTruthy();
    });
  });

  it('renders <a> for items with href, <span> otherwise', () => {
    expect(host.querySelector('a.otc-tag')?.getAttribute('href')).toBe('/js');
    expect(host.querySelectorAll('span.otc-tag')).toHaveLength(2);
  });

  it('applies per-item class and color custom property', () => {
    const hot = host.querySelector('.otc-tag.hot') as HTMLElement;
    expect(hot).toBeTruthy();
    expect(hot.style.getPropertyValue('--otc-tag-color')).toBe('tomato');
  });

  it('keeps hyphenated labels byte-identical with nowrap word spans (#2)', () => {
    fixture.componentRef.setInput('items', [
      { label: 'tag-cloud demo', weight: 5 },
    ]);
    fixture.detectChanges();
    const tag = host.querySelector('.otc-tag')!;
    expect(tag.textContent).toBe('tag-cloud demo');
    expect(tag.querySelector('.otc-nb')?.textContent).toBe('tag-cloud');
  });

  it('sets aria-label when the ariaLabel input is enabled (#4)', () => {
    expect(host.querySelector('.otc-tag')?.hasAttribute('aria-label')).toBe(
      false,
    );
    fixture.componentRef.setInput('ariaLabel', true);
    fixture.detectChanges();
    expect(host.querySelector('.otc-tag')?.getAttribute('aria-label')).toBe(
      'JavaScript, weight 95',
    );
  });

  it('updates the rendered tags when items change', () => {
    fixture.componentRef.setInput('items', items.slice(0, 1));
    fixture.detectChanges();
    expect(host.querySelectorAll('.otc-tag')).toHaveLength(1);
  });

  it('destroys cleanly', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});
