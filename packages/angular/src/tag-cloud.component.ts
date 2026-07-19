import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  prepareTags,
  TagCloudLayout,
  type Fill,
  type PreparedTag,
  type PrepareOptions,
  type TagCloudItem,
} from '@opentagcloud/core';

/**
 * Angular adapter: renders the tags (SSR-safe — the scatter is
 * deterministically seeded, so server and hydrated markup match) and hands
 * layout to `TagCloudLayout` after the view initializes. The host element
 * itself is the cloud container, so give `<otc-tag-cloud>` a sized parent.
 *
 * Styles are injected at runtime by the layout engine. For a styled no-JS/SSR
 * fallback, also add `@opentagcloud/core/styles.css` to your `angular.json`
 * `styles` array (the runtime injection then dedupes to a no-op).
 */
@Component({
  selector: 'otc-tag-cloud',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'otc-cloud' },
  template: `
    @for (p of prepared; track p.key) {
      @if (p.item.href) {
        <a
          [class]="p.className"
          [attr.href]="p.item.href"
          [attr.title]="p.title"
          [attr.aria-label]="p.ariaLabel ?? null"
          [attr.data-fs]="p.fontPx"
          [attr.data-weight]="p.weight"
          [attr.data-key]="p.key"
          [style.font-size.px]="p.fontPx"
          [style.opacity]="p.opacity"
          [style.--otc-tag-color]="p.item.color ?? null"
        >
          @for (part of p.parts; track $index) {
            @if (part.nowrap) {
              <span class="otc-nb">{{ part.text }}</span>
            } @else {
              <ng-container>{{ part.text }}</ng-container>
            }
          }
        </a>
      } @else {
        <span
          [class]="p.className"
          [attr.title]="p.title"
          [attr.aria-label]="p.ariaLabel ?? null"
          [attr.data-fs]="p.fontPx"
          [attr.data-weight]="p.weight"
          [attr.data-key]="p.key"
          [style.font-size.px]="p.fontPx"
          [style.opacity]="p.opacity"
          [style.--otc-tag-color]="p.item.color ?? null"
        >
          @for (part of p.parts; track $index) {
            @if (part.nowrap) {
              <span class="otc-nb">{{ part.text }}</span>
            } @else {
              <ng-container>{{ part.text }}</ng-container>
            }
          }
        </span>
      }
    }
  `,
})
export class TagCloudComponent
  implements OnChanges, AfterViewInit, AfterViewChecked, OnDestroy
{
  /** The tags to lay out. */
  @Input({ required: true }) items: TagCloudItem[] = [];
  /** Font size (px) of the lightest tag. */
  @Input() minPx = 12;
  /** Font size (px) of the heaviest tag. */
  @Input() maxPx = 40;
  /** `'height'`/`'both'` also spreads terms to fill the container's height. */
  @Input() fill?: Fill;
  /** Opacity of the lightest tag (raise for WCAG contrast; 1 disables the fade). */
  @Input() minOpacity = 0.62;
  /** Accessible name per tag: true → "<label>, weight <weight>", or a custom fn. */
  @Input() ariaLabel?: PrepareOptions['ariaLabel'];

  protected prepared: PreparedTag[] = [];
  private layout?: TagCloudLayout;
  private needsRefresh = false;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['items'] ||
      changes['minPx'] ||
      changes['maxPx'] ||
      changes['minOpacity'] ||
      changes['ariaLabel']
    ) {
      this.prepared = prepareTags(this.items, {
        minPx: this.minPx,
        maxPx: this.maxPx,
        minOpacity: this.minOpacity,
        ariaLabel: this.ariaLabel,
      });
      // Re-pack once the view reflects the new tags (attach() packs the initial set).
      this.needsRefresh = !!this.layout;
    }
    if (changes['fill']) this.layout?.setFill(this.fill);
  }

  ngAfterViewInit(): void {
    // TagCloudLayout.attach() is a no-op without a DOM, so this is SSR-safe.
    this.layout = new TagCloudLayout(this.host.nativeElement, {
      fill: this.fill,
    });
    this.layout.attach();
  }

  ngAfterViewChecked(): void {
    if (this.needsRefresh) {
      this.needsRefresh = false;
      this.layout?.refresh();
    }
  }

  ngOnDestroy(): void {
    this.layout?.destroy();
    this.layout = undefined;
  }
}
