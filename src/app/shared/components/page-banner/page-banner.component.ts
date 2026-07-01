import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fadeUp } from '../../../core/animations/animations';

/**
 * Reusable inner-page banner with breadcrumb, gilded title and subtitle
 * over a luxury radial backdrop.
 */
@Component({
  selector: 'app-page-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  animations: [fadeUp],
  template: `
    <section class="relative overflow-hidden border-b border-gold/10 bg-ink-soft py-20 sm:py-24">
      <div class="pointer-events-none absolute inset-0 bg-ink-radial"></div>
      <div
        class="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]"
      ></div>

      <div class="container-lux relative text-center">
        <h1 @fadeUp class="font-display text-4xl font-bold sm:text-5xl">
          {{ titleLead() }} <span class="text-gradient-gold">{{ titleAccent() }}</span>
        </h1>

        @if (subtitle()) {
          <p @fadeUp class="mx-auto mt-5 max-w-xl text-white/60">{{ subtitle() }}</p>
        }

        <nav
          @fadeUp
          class="mt-7 flex items-center justify-center gap-2 text-sm text-white/50"
          aria-label="Breadcrumb"
        >
          <a routerLink="/" class="transition-colors hover:text-gold">Home</a>
          <i class="fa-solid fa-angle-right text-[0.65rem] text-gold/60"></i>
          <span class="text-gold">{{ current() }}</span>
        </nav>
      </div>
    </section>
  `,
})
export class PageBannerComponent {
  readonly titleLead = input<string>('');
  readonly titleAccent = input<string>('');
  readonly subtitle = input<string>('');
  readonly current = input<string>('');
}
