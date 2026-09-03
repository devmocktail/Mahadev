import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  input,
  signal,
  ElementRef,
  inject,
  AfterViewInit,
} from '@angular/core';

/**
 * Animated number counter that counts up from 0 to [value] the first time it
 * scrolls into view, using requestAnimationFrame with an ease-out curve.
 *
 * The signal is only written when the *rounded* value changes, so a slow
 * count (say 0 → 12) renders a dozen times instead of once per frame.
 * Honours `prefers-reduced-motion` by jumping straight to the final value.
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
export class CounterComponent implements AfterViewInit {
  readonly value = input<number>(0);
  readonly suffix = input<string>('');
  readonly duration = input<number>(1800);

  readonly display = signal(0);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;
  private frame?: number;
  private started = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    });
  }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined' || this.prefersReducedMotion()) {
      this.display.set(this.value());
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !this.started) {
          this.started = true;
          this.observer?.disconnect();
          this.animate();
        }
      },
      { threshold: 0.4 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  private animate(): void {
    const target = this.value();
    const duration = this.duration();
    let startTime: number | null = null;
    let last = -1;

    const step = (ts: number): void => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(eased * target);
      if (current !== last) {
        last = current;
        this.display.set(current);
      }
      this.frame = progress < 1 ? requestAnimationFrame(step) : undefined;
    };

    this.frame = requestAnimationFrame(step);
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }
}
