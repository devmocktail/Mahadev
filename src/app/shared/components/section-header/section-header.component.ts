import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RevealDirective } from '../../../core/directives/reveal.directive';

/**
 * Consistent section heading block: eyebrow label, gilded title and
 * an optional subtitle, centered or left-aligned. Reveals on scroll.
 */
@Component({
  selector: 'app-section-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <div
      appReveal
      class="max-w-2xl"
      [class.mx-auto]="align() === 'center'"
      [class.text-center]="align() === 'center'"
    >
      @if (eyebrow()) {
        <span
          class="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-gold"
        >
          <span class="h-px w-6 bg-gold/60"></span>
          {{ eyebrow() }}
          @if (align() === 'center') {
            <span class="h-px w-6 bg-gold/60"></span>
          }
        </span>
      }

      <h2 class="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
        {{ titleLead() }}
        @if (titleAccent()) {
          <span class="text-gradient-gold">{{ titleAccent() }}</span>
        }
      </h2>

      @if (subtitle()) {
        <p class="mt-5 text-base leading-relaxed text-white/65 dark:text-white/65">
          {{ subtitle() }}
        </p>
      }
    </div>
  `,
})
export class SectionHeaderComponent {
  readonly eyebrow = input<string>('');
  readonly titleLead = input<string>('');
  readonly titleAccent = input<string>('');
  readonly subtitle = input<string>('');
  readonly align = input<'center' | 'left'>('center');
}
