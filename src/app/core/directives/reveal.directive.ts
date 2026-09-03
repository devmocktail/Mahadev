import {
  Directive,
  ElementRef,
  inject,
  input,
  DestroyRef,
  AfterViewInit,
  Renderer2,
} from '@angular/core';

/** Must match the transition duration of `.reveal` in styles.scss. */
const REVEAL_DURATION_MS = 800;

/**
 * Scroll-reveal directive. Adds `reveal--visible` when the element enters the
 * viewport, which drives a CSS transition. Reveals once, then gets out of the
 * way completely: the observer is disconnected and the `.reveal` class (and
 * with it the compositing `will-change` hint) is dropped once the transition
 * has finished, so a long page does not accumulate dozens of promoted layers.
 *
 * Usage: <div appReveal [revealDelay]="120"> … </div>
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    class: 'reveal',
  },
})
export class RevealDirective implements AfterViewInit {
  /** Delay in ms before the reveal transition starts. */
  readonly revealDelay = input<number>(0);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;
  private settleTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      if (this.settleTimer) clearTimeout(this.settleTimer);
    });
  }

  ngAfterViewInit(): void {
    const node = this.el.nativeElement as HTMLElement;

    if (typeof IntersectionObserver === 'undefined') {
      this.settle(node);
      return;
    }

    this.renderer.setStyle(node, 'transition-delay', `${this.revealDelay()}ms`);
    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        this.observer?.disconnect();
        this.observer = undefined;
        this.renderer.addClass(node, 'reveal--visible');
        this.settleTimer = setTimeout(
          () => this.settle(node),
          this.revealDelay() + REVEAL_DURATION_MS,
        );
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    this.observer.observe(node);
  }

  /** Return the element to a plain, un-promoted state. */
  private settle(node: HTMLElement): void {
    this.renderer.removeClass(node, 'reveal');
    this.renderer.removeClass(node, 'reveal--visible');
    this.renderer.removeStyle(node, 'transition-delay');
  }
}
