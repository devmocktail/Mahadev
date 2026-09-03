import {
  Directive,
  ElementRef,
  inject,
  input,
  DestroyRef,
  AfterViewInit,
  Renderer2,
} from '@angular/core';

/**
 * Lightweight parallax: translates the element vertically as the page scrolls,
 * scaled by [parallaxSpeed].
 *
 * Cost control:
 *   - one shared scroll listener + one rAF drives every instance on the page,
 *     rather than a listener and a frame request per element,
 *   - instances only participate while on screen (IntersectionObserver),
 *   - all measurements happen before any style writes, so the effect never
 *     causes layout thrash however many elements opt in,
 *   - disabled entirely under `prefers-reduced-motion`.
 *
 * Usage: <div appParallax [parallaxSpeed]="0.12"> … </div>
 */
@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements AfterViewInit {
  readonly parallaxSpeed = input<number>(0.15);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || prefersReducedMotion()) return;

    const node = this.el.nativeElement as HTMLElement;
    this.renderer.setStyle(node, 'will-change', 'transform');

    if (typeof IntersectionObserver === 'undefined') {
      register(this);
    } else {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) register(this);
            else unregister(this);
          }
        },
        { rootMargin: '20% 0px' },
      );
      this.observer.observe(node);
    }

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      unregister(this);
      this.renderer.removeStyle(node, 'will-change');
      this.renderer.removeStyle(node, 'transform');
    });
  }

  /** Read phase — measure only, never write. */
  measure(viewportCenter: number): number {
    const rect = this.el.nativeElement.getBoundingClientRect();
    return (rect.top + rect.height / 2 - viewportCenter) * this.parallaxSpeed();
  }

  /** Write phase — apply the offset measured above. */
  apply(offset: number): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `translate3d(0, ${offset.toFixed(2)}px, 0)`,
    );
  }
}

// ---------------------------------------------------------------------------
// Shared scroll pass: one listener and one animation frame for the whole page.
// ---------------------------------------------------------------------------

const active = new Set<ParallaxDirective>();
let listening = false;
let ticking = false;

function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function onScroll(): void {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const viewportCenter = window.innerHeight / 2;
    // Batch every read, then every write — no interleaved forced reflow.
    const items = [...active];
    const offsets = items.map((item) => item.measure(viewportCenter));
    for (let i = 0; i < items.length; i++) items[i].apply(offsets[i]);
  });
}

function register(directive: ParallaxDirective): void {
  active.add(directive);
  if (!listening) {
    listening = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }
  onScroll();
}

function unregister(directive: ParallaxDirective): void {
  active.delete(directive);
  if (active.size === 0 && listening) {
    listening = false;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  }
}
