import {
  Component,
  ChangeDetectionStrategy,
  booleanAttribute,
  input,
  output,
  viewChild,
} from '@angular/core';
import { GalleryItem } from '../../../core/models';
import { ImgComponent, prefetchVariant } from '../img/img.component';

/** What the card hands the parent when the user opens an image. */
export interface GalleryOpenEvent {
  readonly item: GalleryItem;
  /**
   * The variant this tile actually rendered. It is guaranteed to be in the
   * browser cache, so the lightbox can paint it instantly as a placeholder.
   */
  readonly thumbSrc: string;
}

/**
 * A single masonry gallery tile with hover zoom + caption overlay.
 * Emits `open` when clicked so the parent can drive the lightbox.
 */
@Component({
  selector: 'app-gallery-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImgComponent],
  template: `
    <button
      type="button"
      (click)="emitOpen()"
      (pointerenter)="prefetchFullSize()"
      (focus)="prefetchFullSize()"
      class="group sheen relative block w-full overflow-hidden rounded-2xl bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      [attr.aria-label]="'View ' + item().title"
    >
      <app-img
        [src]="item().image"
        [alt]="item().title + ' — ' + item().category"
        [sizes]="sizes()"
        [eager]="eager()"
        imgClass="h-full w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-110"
      />
      <div
        class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/20 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <span class="text-xs uppercase tracking-[0.25em] text-gold">{{ item().category }}</span>
        <span class="font-display text-lg text-white">{{ item().title }}</span>
      </div>
      <span
        class="absolute right-4 top-4 grid h-10 w-10 translate-y-2 place-content-center rounded-full glass-strong text-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <i class="fa-solid fa-magnifying-glass-plus"></i>
      </span>
    </button>
  `,
})
export class GalleryCardComponent {
  readonly item = input.required<GalleryItem>();
  /** `sizes` for the tile itself. */
  readonly sizes = input<string>(
    '(min-width: 1280px) 384px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw',
  );
  /** `sizes` the lightbox will render at — used to prefetch the right variant. */
  readonly lightboxSizes = input<string>('100vw');
  /** Set on tiles that start in the viewport so they are not lazy-deferred. */
  readonly eager = input(false, { transform: booleanAttribute });

  readonly open = output<GalleryOpenEvent>();

  private readonly img = viewChild(ImgComponent);

  emitOpen(): void {
    this.open.emit({ item: this.item(), thumbSrc: this.img()?.currentSrc() ?? this.item().image });
  }

  /**
   * On hover/focus, pull the lightbox-resolution variant into cache so the
   * upgrade after opening is instant too. A no-op if already cached.
   */
  prefetchFullSize(): void {
    prefetchVariant(this.item().image, this.lightboxSizes());
  }
}
