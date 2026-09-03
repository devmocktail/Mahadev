import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  ElementRef,
  signal,
  inject,
  AfterViewInit,
} from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TESTIMONIALS } from '../../core/data/testimonials.data';
import { fadeIn } from '../../core/animations/animations';

/**
 * Auto-sliding testimonial carousel with star ratings, client avatars, dot
 * navigation and pause-on-hover.
 *
 * The timer only runs while the section is actually on screen and the tab is
 * visible, so a backgrounded page or a user reading further down the page
 * costs nothing.
 */
@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent],
  animations: [fadeIn],
  templateUrl: './testimonials-section.component.html',
})
export class TestimonialsSectionComponent implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly testimonials = TESTIMONIALS;
  readonly active = signal(0);

  private timer?: ReturnType<typeof setInterval>;
  private observer?: IntersectionObserver;
  private onScreen = false;
  private readonly intervalMs = 5500;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.stop();
      this.observer?.disconnect();
      document.removeEventListener('visibilitychange', this.syncTimer);
    });
  }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.onScreen = true;
      this.start();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        this.onScreen = entries.some((e) => e.isIntersecting);
        this.syncTimer();
      },
      { threshold: 0.2 },
    );
    this.observer.observe(this.host.nativeElement);
    document.addEventListener('visibilitychange', this.syncTimer);
  }

  /** Runs the timer only when the carousel is both visible and on screen. */
  private readonly syncTimer = (): void => {
    const shouldRun = this.onScreen && document.visibilityState === 'visible';
    if (shouldRun && !this.timer) this.start();
    else if (!shouldRun) this.stop();
  };

  start(): void {
    this.stop();
    this.timer = setInterval(() => this.next(), this.intervalMs);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  next(): void {
    this.active.update((i) => (i + 1) % this.testimonials.length);
  }

  prev(): void {
    this.active.update((i) => (i - 1 + this.testimonials.length) % this.testimonials.length);
  }

  goTo(i: number): void {
    this.active.set(i);
  }

  /** Restart the timer after a manual interaction so the cadence feels natural. */
  restart(): void {
    if (this.onScreen) this.start();
  }

  stars(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i);
  }

  /** Active dot is an elongated gold pill; inactive dots are small + dim. */
  dotClass(i: number): string {
    const base = 'h-2 rounded-full transition-all duration-300';
    return this.active() === i ? `${base} w-8 bg-gold` : `${base} w-2 bg-white/25 hover:bg-white/50`;
  }
}
