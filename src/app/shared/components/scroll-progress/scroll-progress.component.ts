import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Thin gold progress bar pinned to the top of the viewport.
 *
 * The bar reads `--scroll-progress` (written by `ScrollService` on each
 * animation frame) directly in CSS, so scrolling never triggers a change
 * detection run for it — the compositor animates the transform on its own.
 */
@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="scroll-progress fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gold-gradient"
      role="progressbar"
      aria-label="Page scroll progress"
    ></div>
  `,
  styles: [
    `
      .scroll-progress {
        transform: scaleX(var(--scroll-progress, 0));
        will-change: transform;
      }
    `,
  ],
})
export class ScrollProgressComponent {}
