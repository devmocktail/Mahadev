import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { RippleDirective } from '../../../core/directives/ripple.directive';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Reusable luxury button.
 * Renders as <a routerLink>, <a href> or <button> based on inputs,
 * with a gold ripple on press and three premium variants.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgTemplateOutlet, RippleDirective],
  template: `
    <ng-template #content>
      @if (icon()) {
        <i [class]="icon()" class="text-[0.95em]"></i>
      }
      <span><ng-content /></span>
    </ng-template>

    @if (routerLink()) {
      <a appRipple [routerLink]="routerLink()" [class]="classes" [attr.aria-label]="ariaLabel()">
        <ng-container [ngTemplateOutlet]="content" />
      </a>
    } @else if (href()) {
      <a
        appRipple
        [href]="href()"
        [attr.target]="external() ? '_blank' : null"
        [attr.rel]="external() ? 'noopener noreferrer' : null"
        [class]="classes"
        [attr.aria-label]="ariaLabel()"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </a>
    } @else {
      <button appRipple [type]="type()" [class]="classes" [attr.aria-label]="ariaLabel()">
        <ng-container [ngTemplateOutlet]="content" />
      </button>
    }
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly routerLink = input<string | null>(null);
  readonly href = input<string | null>(null);
  readonly external = input<boolean>(false);
  readonly type = input<'button' | 'submit'>('button');
  readonly icon = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly fullWidth = input<boolean>(false);

  get classes(): string {
    const base =
      'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-500 ease-lux focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink';

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-5 py-2 text-sm',
      md: 'px-7 py-3 text-sm sm:text-base',
      lg: 'px-9 py-4 text-base',
    };

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-gold-gradient text-ink shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5',
      outline:
        'border border-gold/60 text-gold hover:bg-gold hover:text-ink hover:-translate-y-0.5',
      ghost: 'text-white/80 hover:text-gold',
    };

    return [base, sizes[this.size()], variants[this.variant()], this.fullWidth() ? 'w-full' : '']
      .join(' ')
      .trim();
  }
}
