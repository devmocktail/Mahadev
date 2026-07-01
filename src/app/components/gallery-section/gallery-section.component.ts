import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  HostListener,
} from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { GalleryCardComponent } from '../../shared/components/gallery-card/gallery-card.component';
import { GALLERY, GALLERY_CATEGORIES } from '../../core/data/gallery.data';
import { GalleryCategory, GalleryItem } from '../../core/models';
import { fadeIn, scaleIn, staggerList } from '../../core/animations/animations';

/**
 * Masonry gallery with category filters and an accessible lightbox
 * (keyboard arrows + escape, prev/next navigation, image zoom).
 */
@Component({
  selector: 'app-gallery-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, GalleryCardComponent],
  animations: [fadeIn, scaleIn, staggerList],
  templateUrl: './gallery-section.component.html',
})
export class GallerySectionComponent {
  /** Optional cap for a homepage preview grid. */
  readonly limit = input<number | null>(null);

  readonly categories = GALLERY_CATEGORIES;
  readonly activeCategory = signal<'All' | GalleryCategory>('All');

  private readonly all = GALLERY;

  readonly filtered = computed(() => {
    const cat = this.activeCategory();
    const list = cat === 'All' ? this.all : this.all.filter((g) => g.category === cat);
    const max = this.limit();
    return max ? list.slice(0, max) : list;
  });

  // ----- Lightbox state -----
  readonly lightboxIndex = signal<number | null>(null);
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

  openLightbox(item: GalleryItem): void {
    const i = this.filtered().findIndex((g) => g.id === item.id);
    if (i !== -1) this.lightboxIndex.set(i);
  }

  closeLightbox(): void {
    this.lightboxIndex.set(null);
  }

  next(): void {
    this.lightboxIndex.update((i) =>
      i === null ? i : (i + 1) % this.filtered().length,
    );
  }

  prev(): void {
    this.lightboxIndex.update((i) =>
      i === null ? i : (i - 1 + this.filtered().length) % this.filtered().length,
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleKeys(event: KeyboardEvent): void {
    if (this.lightboxIndex() === null) return;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
  }
}
