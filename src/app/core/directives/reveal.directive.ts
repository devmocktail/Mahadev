import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  AfterViewInit,
  Renderer2,
} from '@angular/core';

/**
 * Scroll-reveal directive.
 * Adds a `reveal--visible` class when the element enters the viewport,
 * enabling CSS transitions. Respects a configurable delay and only
 * animates once for a clean, premium feel.
 *
 * Usage: <div appReveal [revealDelay]="120"> ... </div>
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    class: 'reveal',
  },
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  /** Delay in ms before the reveal transition starts. */
  readonly revealDelay = input<number>(0);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const node = this.el.nativeElement as HTMLElement;
    this.renderer.setStyle(node, 'transition-delay', `${this.revealDelay()}ms`);

    if (typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(node, 'reveal--visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.renderer.addClass(node, 'reveal--visible');
            this.observer?.unobserve(node);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
