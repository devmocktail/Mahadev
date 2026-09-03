import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  HostListener,
} from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import {
  GalleryCardComponent,
  type GalleryOpenEvent,
} from '../../shared/components/gallery-card/gallery-card.component';
import { ImgComponent, prefetchVariant } from '../../shared/components/img/img.component';
import { GALLERY, GALLERY_CATEGORIES } from '../../core/data/gallery.data';
import { GalleryCategory, GalleryItem } from '../../core/models';
import { fadeIn, scaleIn, staggerList } from '../../core/animations/animations';

/** The width the lightbox renders at — kept in one place so the tiles can
 *  prefetch exactly the variant the lightbox will ask for. */
export const LIGHTBOX_SIZES = '(min-width: 896px) 896px, 92vw';

/**
 * Masonry gallery with category filters and an accessible lightbox
 * (keyboard arrows + escape, prev/next navigation, image zoom).
 */
@Component({
  selector: 'app-gallery-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, GalleryCardComponent, ImgComponent],
  animations: [fadeIn, scaleIn, staggerList],
  templateUrl: './gallery-section.component.html',
})
export class GallerySectionComponent {
  /** Optional cap for a homepage preview grid. */
  readonly limit = input<number | null>(null);

  readonly categories = GALLERY_CATEGORIES;
  readonly activeCategory = signal<'All' | GalleryCategory>('All');
  readonly lightboxSizes = LIGHTBOX_SIZES;

  private readonly all = GALLERY;

  readonly filtered = computed(() => {
    const cat = this.activeCategory();
    const list = cat === 'All' ? this.all : this.all.filter((g) => g.category === cat);
    const max = this.limit();
    return max ? list.slice(0, max) : list;
  });

  // ----- Lightbox state -----
  readonly lightboxIndex = signal<number | null>(null);
  /**
   * The cached thumbnail for the image on screen, used as an instant
   * placeholder so opening the lightbox never shows an empty frame.
   * Cleared when navigating to a neighbour whose thumbnail we don't have.
   */
  readonly lightboxThumb = signal<string | null>(null);

  readonly lightboxItem = computed<GalleryItem | null>(() => {
    const i = this.lightboxIndex();
    return i === null ? null : (this.filtered()[i] ?? null);
  });

  setCategory(cat: 'All' | GalleryCategory): void {
    this.activeCategory.set(cat);
  }

  /** Returns the full class list for a filter chip based on active state. */
  chipClass(cat: 'All' | GalleryCategory): string {
    const base = 'rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300';
    return this.activeCategory() === cat
      ? `${base} border-gold bg-gold-gradient text-ink shadow-gold`
      : `${base} border-gold/25 text-white/70 hover:border-gold/60 hover:text-gold`;
  }

  openLightbox(event: GalleryOpenEvent): void {
    const i = this.filtered().findIndex((g) => g.id === event.item.id);
    if (i === -1) return;
    this.lightboxThumb.set(event.thumbSrc);
    this.lightboxIndex.set(i);
    this.prefetchNeighbours(i);
  }

  closeLightbox(): void {
    this.lightboxIndex.set(null);
    this.lightboxThumb.set(null);
  }

  next(): void {
    this.step(1);
  }

  prev(): void {
    this.step(-1);
  }

  /**
   * Move through the lightbox. Neighbours were prefetched when the lightbox
   * opened (and again on each step), so there is no placeholder to show —
   * the next image is already in cache.
   */
  private step(delta: number): void {
    const total = this.filtered().length;
    if (total === 0) return;
    const current = this.lightboxIndex();
    if (current === null) return;
    const nextIndex = (current + delta + total) % total;
    this.lightboxThumb.set(null);
    this.lightboxIndex.set(nextIndex);
    this.prefetchNeighbours(nextIndex);
  }

  /** Warm the images either side of `index` at lightbox resolution. */
  private prefetchNeighbours(index: number): void {
    const list = this.filtered();
    if (list.length < 2) return;
    for (const delta of [1, -1]) {
      const neighbour = list[(index + delta + list.length) % list.length];
      if (neighbour) prefetchVariant(neighbour.image, LIGHTBOX_SIZES);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeys(event: KeyboardEvent): void {
    if (this.lightboxIndex() === null) return;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
  }
}
