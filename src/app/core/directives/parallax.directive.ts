import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  AfterViewInit,
  NgZone,
  Renderer2,
} from '@angular/core';

/**
 * Lightweight parallax: translates the element vertically as the page
 * scrolls, scaled by [parallaxSpeed]. Runs outside Angular's zone and
 * throttles via requestAnimationFrame for buttery performance.
 *
 * Usage: <img appParallax [parallaxSpeed]="0.12" />
 */
@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  readonly parallaxSpeed = input<number>(0.15);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private ticking = false;
  private onScroll = (): void => this.requestTick();

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.update();
    });
  }

  private requestTick(): void {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => this.update());
  }

  private update(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const offset = (rect.top + rect.height / 2 - viewportCenter) * this.parallaxSpeed();
    this.renderer.setStyle(this.el.nativeElement, 'transform', `translate3d(0, ${offset}px, 0)`);
    this.ticking = false;
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
    }
  }
}
