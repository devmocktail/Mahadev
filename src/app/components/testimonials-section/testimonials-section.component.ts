import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TESTIMONIALS } from '../../core/data/testimonials.data';
import { fadeIn } from '../../core/animations/animations';

/**
 * Auto-sliding testimonial carousel with star ratings, client avatars,
 * dot navigation and pause-on-hover. Cleans up its interval on destroy.
 */
@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent],
  animations: [fadeIn],
  templateUrl: './testimonials-section.component.html',
})
export class TestimonialsSectionComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);

  readonly testimonials = TESTIMONIALS;
  readonly active = signal(0);

  private timer?: ReturnType<typeof setInterval>;
  private readonly intervalMs = 5500;

  ngOnInit(): void {
    this.start();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  start(): void {
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => this.zone.run(() => this.next()), this.intervalMs);
    });
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
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
    this.stop();
    this.start();
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
