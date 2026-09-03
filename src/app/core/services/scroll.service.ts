import { DestroyRef, Injectable, inject, signal } from '@angular/core';

/** Progress past which the back-to-top button appears. */
const BACK_TO_TOP_AT = 0.12;
/** Pixels scrolled before the navbar switches to its condensed style. */
const SCROLLED_AT = 60;

/**
 * Tracks scroll state for the navbar, progress bar and back-to-top button.
 *
 * The raw 0–1 progress changes on every frame, so it is deliberately *not* a
 * signal — it is written straight to the `--scroll-progress` custom property
 * on <html> and consumed by CSS. Only the two coarse booleans, which flip a
 * handful of times per page, are signals. That keeps a full-page scroll to a
 * couple of change detection runs instead of one per animation frame.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly destroyRef = inject(DestroyRef);

  /** True once the user has scrolled past `SCROLLED_AT` pixels. */
  readonly scrolled = signal(false);
  /** True once the user is far enough down for the back-to-top affordance. */
  readonly pastFold = signal(false);

  private initialized = false;

  init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    let ticking = false;
    const root = document.documentElement;

    const measure = (): void => {
      ticking = false;
      const max = root.scrollHeight - root.clientHeight;
      const top = root.scrollTop || window.scrollY;
      const progress = max > 0 ? Math.min(top / max, 1) : 0;

      // Per-frame work: one style write, zero change detection.
      root.style.setProperty('--scroll-progress', progress.toFixed(4));

      // Signals change only on threshold crossings.
      const scrolled = top > SCROLLED_AT;
      if (scrolled !== this.scrolled()) this.scrolled.set(scrolled);

      const pastFold = progress > BACK_TO_TOP_AT;
      if (pastFold !== this.pastFold()) this.pastFold.set(pastFold);
    };

    const handler = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler, { passive: true });
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    });

    measure();
  }

  scrollToTop(): void {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: this.scrollBehavior() });
  }

  scrollToId(id: string): void {
    if (typeof document === 'undefined') return;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: this.scrollBehavior(), block: 'start' });
  }

  private scrollBehavior(): ScrollBehavior {
    return typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
  }
}
