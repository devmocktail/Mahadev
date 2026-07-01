import { Injectable, signal, NgZone, inject } from '@angular/core';

/**
 * Tracks scroll progress (0–1) and a "scrolled past threshold" flag.
 * Drives the scroll progress bar, navbar styling and back-to-top button.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly zone = inject(NgZone);

  /** 0 → 1 fraction of the page scrolled. */
  readonly progress = signal(0);
  /** True once the user has scrolled beyond ~60px. */
  readonly scrolled = signal(false);

  private initialized = false;

  init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    this.zone.runOutsideAngular(() => {
      let ticking = false;
      const handler = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const el = document.documentElement;
          const max = el.scrollHeight - el.clientHeight;
          const top = el.scrollTop || window.scrollY;
          this.zone.run(() => {
            this.progress.set(max > 0 ? top / max : 0);
            this.scrolled.set(top > 60);
          });
          ticking = false;
        });
      };
      window.addEventListener('scroll', handler, { passive: true });
      handler();
    });
  }

  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  scrollToId(id: string): void {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
