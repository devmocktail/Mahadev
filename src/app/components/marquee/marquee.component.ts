import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Infinite gold marquee of specialisations — a premium, always-in-motion
 * accent strip. Pure CSS animation, pauses on hover, mobile friendly.
 */
@Component({
  selector: 'app-marquee',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="group relative flex overflow-hidden border-y border-gold/15 bg-ink-soft py-5 select-none"
      aria-hidden="true"
    >
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-soft to-transparent sm:w-28"></div>
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink-soft to-transparent sm:w-28"></div>

      <div class="marquee-track flex shrink-0 items-center gap-10 pr-10 group-hover:[animation-play-state:paused]">
        @for (item of loop; track $index) {
          <span class="flex items-center gap-4">
            <i class="fa-solid fa-star text-xs text-gold"></i>
            <span class="font-display text-lg text-white/85 sm:text-2xl">{{ item }}</span>
          </span>
        }
      </div>
      <div class="marquee-track flex shrink-0 items-center gap-10 pr-10 group-hover:[animation-play-state:paused]">
        @for (item of loop; track $index) {
          <span class="flex items-center gap-4">
            <i class="fa-solid fa-star text-xs text-gold"></i>
            <span class="font-display text-lg text-white/85 sm:text-2xl">{{ item }}</span>
          </span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .marquee-track {
        animation: marquee-scroll 26s linear infinite;
        will-change: transform;
      }
      @keyframes marquee-scroll {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-100%);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .marquee-track {
          animation: none;
        }
      }
    `,
  ],
})
export class MarqueeComponent {
  readonly loop = [
    'Birthday Decorations',
    'Anniversary Setups',
    'Proposal Decor',
    'Balloon Decoration',
    'Flower Decoration',
    'Surprise Events',
    'Festival Decorations',
    'Corporate Events',
    'Baby Showers',
  ];
}
