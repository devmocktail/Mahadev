import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { FEATURES } from '../../core/data/features.data';

/** "Why Choose Us" — grid of luxury feature cards with icon badges. */
@Component({
  selector: 'app-why-choose',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, RevealDirective],
  template: `
    <section id="why-choose" class="relative overflow-hidden bg-ink-soft py-16 sm:py-20 lg:py-24">
      <div class="pointer-events-none absolute inset-0 bg-ink-radial opacity-60"></div>
      <div class="container-lux relative">
        <app-section-header
          eyebrow="Why Choose Us"
          titleLead="The Mahadev"
          titleAccent="Difference"
          subtitle="A relentless commitment to quality, creativity and care — that's why our clients trust us with their most precious moments."
        />

        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (feature of features; track feature.title; let i = $index) {
            <div
              appReveal
              [revealDelay]="(i % 4) * 80"
              class="group sheen relative overflow-hidden rounded-3xl glass p-7 hover-lift"
            >
              <span
                class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              ></span>
              <span
                class="relative grid h-14 w-14 place-content-center rounded-2xl bg-gold-gradient text-xl text-ink shadow-gold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
              >
                <i [class]="feature.icon"></i>
              </span>
              <h3 class="relative mt-5 font-display text-lg text-white">{{ feature.title }}</h3>
              <p class="relative mt-2 text-sm leading-relaxed text-white/60">
                {{ feature.description }}
              </p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class WhyChooseComponent {
  readonly features = FEATURES;
}

