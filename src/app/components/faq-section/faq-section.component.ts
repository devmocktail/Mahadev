import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { FAQS } from '../../core/data/features.data';
import { expandCollapse } from '../../core/animations/animations';

/** Accessible FAQ accordion with a single open panel and smooth expand. */
@Component({
  selector: 'app-faq-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent],
  animations: [expandCollapse],
  template: `
    <section id="faq" class="relative bg-ink-soft py-16 sm:py-20 lg:py-24">
      <div class="container-lux">
        <app-section-header
          eyebrow="Good to Know"
          titleLead="Frequently Asked"
          titleAccent="Questions"
          subtitle="Everything you need to know before booking your celebration with us."
        />

        <div class="mx-auto mt-12 max-w-3xl space-y-4">
          @for (faq of faqs; track faq.question; let i = $index) {
            <div class="overflow-hidden rounded-2xl glass">
              <button
                type="button"
                (click)="toggle(i)"
                class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                [attr.aria-expanded]="openIndex() === i"
              >
                <span class="font-display text-lg text-white">{{ faq.question }}</span>
                <span
                  class="grid h-9 w-9 shrink-0 place-content-center rounded-full border border-gold/30 text-gold transition-transform duration-300"
                  [class.rotate-45]="openIndex() === i"
                >
                  <i class="fa-solid fa-plus"></i>
                </span>
              </button>
              <div
                [@expandCollapse]="openIndex() === i ? 'expanded' : 'collapsed'"
                class="px-6"
              >
                <p class="pb-5 text-sm leading-relaxed text-white/60">{{ faq.answer }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class FaqSectionComponent {
  readonly faqs = FAQS;
  readonly openIndex = signal<number | null>(0);

  toggle(i: number): void {
    this.openIndex.update((current) => (current === i ? null : i));
  }
}

