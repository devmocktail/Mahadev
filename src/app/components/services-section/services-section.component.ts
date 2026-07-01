import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { SERVICES } from '../../core/data/services.data';
import { ServiceItem } from '../../core/models';

/**
 * Services grid of premium glass cards. On the home page we show a
 * limited preview; the dedicated page shows the full catalogue.
 */
@Component({
  selector: 'app-services-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, ServiceCardComponent, ButtonComponent, RevealDirective],
  template: `
    <section id="services" class="relative py-16 sm:py-20 lg:py-24">
      <div class="pointer-events-none absolute inset-0 bg-ink-radial opacity-50"></div>
      <div class="container-lux relative">
        <app-section-header
          eyebrow="What We Do"
          titleLead="Our Signature"
          titleAccent="Services"
          subtitle="From intimate surprises to grand celebrations, every service is delivered with a premium, detail-obsessed finish."
        />

        <div class="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          @for (service of visibleServices(); track service.slug; let i = $index) {
            <div appReveal [revealDelay]="(i % 3) * 90">
              <app-service-card [service]="service" />
            </div>
          }
        </div>

        @if (limit() && limit()! < allServices.length) {
          <div class="mt-12 text-center">
            <app-button routerLink="/services" variant="outline" icon="fa-solid fa-arrow-right-long">
              View All Services
            </app-button>
          </div>
        }
      </div>
    </section>
  `,
})
export class ServicesSectionComponent {
  /** Optional cap on number of cards shown (used for the home preview). */
  readonly limit = input<number | null>(null);

  readonly allServices = SERVICES;

  visibleServices(): ServiceItem[] {
    const max = this.limit();
    return max ? this.allServices.slice(0, max) : this.allServices;
  }
}

