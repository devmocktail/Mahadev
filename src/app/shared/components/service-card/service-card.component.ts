import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceItem } from '../../../core/models';
import { ButtonComponent } from '../button/button.component';

/**
 * Premium glass service card: image, glyph badge, title, description and a
 * Book Now CTA. Lifts and glows on hover with an image zoom.
 */
@Component({
  selector: 'app-service-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent],
  template: `
    <article
      class="group sheen relative flex h-full flex-col overflow-hidden rounded-3xl glass hover-lift"
    >
      <!-- Image -->
      <div class="relative aspect-[4/3] overflow-hidden">
        <img
          [src]="service().image"
          [alt]="service().title + ' by Mahadev Eventz'"
          width="600"
          height="450"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent"></div>
        <span
          class="absolute left-4 top-4 grid h-12 w-12 place-content-center rounded-2xl glass-strong text-2xl shadow-gold"
          aria-hidden="true"
        >
          {{ service().icon }}
        </span>
      </div>

      <!-- Body -->
      <div class="flex flex-1 flex-col gap-3 p-6">
        <h3 class="flex items-center gap-2 font-display text-xl text-white">
          <i [class]="service().faIcon" class="text-base text-gold"></i>
          {{ service().title }}
        </h3>
        <p class="flex-1 text-sm leading-relaxed text-white/60">{{ service().description }}</p>

        <div class="flex flex-wrap gap-2 pt-1">
          @for (chip of service().highlights; track chip) {
            <span class="rounded-full border border-gold/20 px-3 py-1 text-[0.7rem] text-gold/80">
              {{ chip }}
            </span>
          }
        </div>

        <div class="pt-4">
          <app-button routerLink="/booking" variant="outline" size="sm" [fullWidth]="true">
            Book Now
          </app-button>
        </div>
      </div>
    </article>
  `,
})
export class ServiceCardComponent {
  readonly service = input.required<ServiceItem>();
}
