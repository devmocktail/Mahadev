import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { GalleryItem } from '../../../core/models';

/**
 * A single masonry gallery tile with hover zoom + caption overlay.
 * Emits `open` when clicked so the parent can drive the lightbox.
 */
@Component({
  selector: 'app-gallery-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="open.emit(item())"
      class="group sheen relative block w-full overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      [attr.aria-label]="'View ' + item().title"
    >
      <img
        [src]="item().image"
        [alt]="item().title + ' — ' + item().category"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-110"
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
  readonly open = output<GalleryItem>();
}
