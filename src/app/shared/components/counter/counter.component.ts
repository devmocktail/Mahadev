import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  ElementRef,
  inject,
  AfterViewInit,
  OnDestroy,
  NgZone,
} from '@angular/core';

/**
 * Animated number counter that counts up from 0 to [value] the first time
 * it scrolls into view. Uses requestAnimationFrame with an ease-out curve.
 */
@Component({
  selector: 'app-counter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="font-display text-4xl font-bold text-gradient-gold sm:text-5xl">
      {{ display() }}{{ suffix() }}
    </span>
  `,
})
export class CounterComponent implements AfterViewInit, OnDestroy {
  readonly value = input<number>(0);
  readonly suffix = input<string>('');
  readonly duration = input<number>(1800);

  readonly display = signal(0);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private observer?: IntersectionObserver;
  private started = false;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.display.set(this.value());
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !this.started) {
          this.started = true;
          this.animate();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  private animate(): void {
    const target = this.value();
    const duration = this.duration();
    this.zone.runOutsideAngular(() => {
      let startTime: number | null = null;
      const step = (ts: number) => {
        if (startTime === null) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.round(eased * target);
        this.zone.run(() => this.display.set(current));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
