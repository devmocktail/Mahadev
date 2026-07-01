import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ScrollService } from '../../../core/services/scroll.service';

/** Thin gold progress bar pinned to the very top of the viewport. */
@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gold-gradient"
      [style.transform]="'scaleX(' + scroll.progress() + ')'"
      role="progressbar"
      aria-label="Page scroll progress"
    ></div>
  `,
})
export class ScrollProgressComponent {
  readonly scroll = inject(ScrollService);
}
