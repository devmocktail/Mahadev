import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { fadeUp } from '../../core/animations/animations';

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  animations: [fadeUp],
  template: `
    <section
      class="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-ink py-16 sm:py-20 lg:py-24"
    >
      <div class="pointer-events-none absolute inset-0 bg-ink-radial"></div>
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]"
      ></div>

      <div class="container-lux relative text-center">
        <p @fadeUp class="font-display text-[8rem] font-bold leading-none text-gradient-gold sm:text-[12rem]">
          404
        </p>
        <h1 @fadeUp class="font-display text-2xl text-white sm:text-3xl">
          This page took an unplanned detour
        </h1>
        <p @fadeUp class="mx-auto mt-4 max-w-md text-white/60">
          The celebration you're looking for isn't here — but we have plenty more to explore.
        </p>
        <div @fadeUp class="mt-9 flex flex-wrap justify-center gap-4">
          <app-button routerLink="/" icon="fa-solid fa-house">Back Home</app-button>
          <app-button routerLink="/gallery" variant="outline" icon="fa-solid fa-images">
            View Gallery
          </app-button>
        </div>
      </div>
    </section>
  `,
})
export class NotFoundComponent {}

