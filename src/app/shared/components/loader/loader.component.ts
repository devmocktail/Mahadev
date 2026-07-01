import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/**
 * Inline luxury loading spinner — concentric gold rings around the brand
 * monogram. Used for in-page loading states (e.g. booking submission).
 */
@Component({
  selector: 'app-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div class="relative" [style.width.px]="size()" [style.height.px]="size()">
        <span
          class="absolute inset-0 rounded-full border-2 border-gold/20 border-t-gold"
          style="animation: prebloom-spin 0.9s linear infinite"
        ></span>
        <span
          class="absolute inset-2 rounded-full border-2 border-gold/10 border-b-gold/70"
          style="animation: prebloom-spin 1.4s linear infinite reverse"
        ></span>
        <span class="absolute inset-0 grid place-content-center font-display text-gold">S</span>
      </div>
      @if (label()) {
        <p class="text-xs uppercase tracking-[0.3em] text-gold/80">{{ label() }}</p>
      }
      <span class="sr-only">Loading</span>
    </div>
  `,
})
export class LoaderComponent {
  readonly size = input<number>(56);
  readonly label = input<string>('');
}
