import {
  Directive,
  ElementRef,
  inject,
  input,
  DestroyRef,
  AfterViewInit,
  Renderer2,
  signal,
} from '@angular/core';

/**
 * Longest we will ever leave content hidden waiting for the observer.
 * A scroll-in animation is decoration; content must never depend on it.
 */
const SAFETY_REVEAL_MS = 3500;

/**
 * Scroll-reveal directive: fades content up as it enters the viewport.
 *
 * Deliberately fails *visible*. The hidden state lives in `reveal--armed`,
 * applied by this directive through a host binding rather than sitting in a
 * static stylesheet rule, which means:
 *
 *   - if JS never runs, or the bundle fails to load, content is simply visible;
 *   - if `prefers-reduced-motion` is set, or IntersectionObserver is missing,
 *     nothing is ever armed;
 *   - if the observer never reports an intersection — it can coalesce callbacks
 *     during fast or programmatic scrolling, and an in-page anchor can jump
 *     clean past an element — a safety timer reveals it anyway.
 *
 * Previously `opacity: 0` was a plain CSS rule on `.reveal`, so any one of
 * those cases left whole sections permanently invisible.
 *
 * Because the host binding is applied during the element's first render, there
 * is no frame where the content paints before being hidden.
 *
 * Usage: <div appReveal [revealDelay]="120"> … </div>
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    class: 'reveal',
    '[class.reveal--armed]': 'armed()',
  },
})
export class RevealDirective implements AfterViewInit {
  /** Delay in ms before the reveal transition starts. */
  readonly revealDelay = input<number>(0);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  /** True while the element is held hidden, waiting to be revealed. */
  protected readonly armed = signal(shouldAnimate());

  private observer?: IntersectionObserver;
  private safetyTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.destroyRef.onDestroy(() => this.stopWatching());
  }

  ngAfterViewInit(): void {
    if (!this.armed()) return;

    const node = this.el.nativeElement as HTMLElement;
    this.renderer.setStyle(node, 'transition-delay', `${this.revealDelay()}ms`);

    // threshold 0: reveal the moment any pixel is on screen. A non-zero
    // threshold silently never fires for an element taller than the viewport
    // can show that fraction of — which is easy to hit on a phone.
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) this.reveal();
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(node);

    this.safetyTimer = setTimeout(() => this.reveal(), SAFETY_REVEAL_MS);
  }

  /** Show the element and stop watching. Idempotent. */
  private reveal(): void {
    if (!this.armed()) return;
    this.armed.set(false);
    this.stopWatching();
    // `will-change` lives on .reveal--armed, so dropping the class releases
    // the compositor layer automatically once the transition finishes.
    this.renderer.removeStyle(this.el.nativeElement, 'transition-delay');
  }

  private stopWatching(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    if (this.safetyTimer) clearTimeout(this.safetyTimer);
    this.safetyTimer = undefined;
  }
}

/** Whether this environment should animate at all. */
function shouldAnimate(): boolean {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return false;
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }
  return true;
}
