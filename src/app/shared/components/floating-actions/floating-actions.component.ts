import { Component, ChangeDetectionStrategy } from '@angular/core';
import { COMPANY } from '../../../core/data/company.data';

/** Floating WhatsApp + Call quick-action buttons (bottom-left). */
@Component({
  selector: 'app-floating-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-5 left-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:left-6">
      <!-- WhatsApp -->
      <a
        [href]="whatsappLink"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        class="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:h-14 sm:w-14"
      >
        <!-- ping ring: a thin expanding outline that never hides the glyph -->
        <span
          class="absolute inset-0 rounded-full ring-2 ring-[#25D366] animate-pulse-ring"
          aria-hidden="true"
        ></span>
        <i class="fa-brands fa-whatsapp relative text-2xl sm:text-[1.6rem]"></i>
        <span
          class="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-ink-soft px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-glass transition-opacity duration-300 group-hover:opacity-100 lg:block"
        >
          Chat on WhatsApp
        </span>
      </a>

      <!-- Call -->
      <a
        [href]="'tel:+' + company.phoneIntl"
        aria-label="Call us"
        class="group relative flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-ink shadow-gold transition-transform duration-300 hover:-translate-y-1 sm:h-14 sm:w-14"
      >
        <i class="fa-solid fa-phone relative text-lg sm:text-xl"></i>
        <span
          class="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-ink-soft px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-glass transition-opacity duration-300 group-hover:opacity-100 lg:block"
        >
          Call {{ company.phoneDisplay }}
        </span>
      </a>
    </div>
  `,
})
export class FloatingActionsComponent {
  readonly company = COMPANY;

  get whatsappLink(): string {
    return `https://wa.me/${this.company.phoneIntl}?text=${encodeURIComponent(this.company.whatsappMessage)}`;
  }
}
