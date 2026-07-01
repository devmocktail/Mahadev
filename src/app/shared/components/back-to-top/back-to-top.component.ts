import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { ScrollService } from '../../../core/services/scroll.service';
import { scaleIn } from '../../../core/animations/animations';

/** Floating "scroll to top" button, revealed after scrolling down. */
@Component({
  selector: 'app-back-to-top',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleIn],
  template: `
    @if (visible()) {
      <button
        @scaleIn
        type="button"
        (click)="scroll.scrollToTop()"
        aria-label="Back to top"
        class="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-content-center rounded-full bg-gold-gradient text-ink shadow-gold transition-transform duration-300 hover:-translate-y-1 hover:shadow-gold-lg"
      >
        <i class="fa-solid fa-arrow-up"></i>
      </button>
    }
  `,
})
export class BackToTopComponent {
  readonly scroll = inject(ScrollService);
  readonly visible = computed(() => this.scroll.progress() > 0.12);
}
