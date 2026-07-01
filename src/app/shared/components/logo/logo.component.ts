import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Brand lockup: the gilded "S" monogram + Mahadev Eventz wordmark.
 * Links home by default. Used in the navbar and footer.
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="group flex items-center gap-3" aria-label="Mahadev Eventz home">
      <span
        class="grid h-11 w-11 place-content-center rounded-full border border-gold/50 bg-ink-soft font-display text-2xl font-bold text-gradient-gold shadow-gold transition-transform duration-500 ease-lux group-hover:rotate-6"
      >
        S
      </span>
      <span class="flex flex-col leading-none">
        <span class="font-display text-lg font-bold tracking-wide text-white">Mahadev</span>
        <span class="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-gold">
          Eventz
        </span>
      </span>
    </a>
  `,
})
export class LogoComponent {
  readonly compact = input<boolean>(false);
}
