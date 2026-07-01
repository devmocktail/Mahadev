import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ParallaxDirective } from '../../core/directives/parallax.directive';
import { fadeUp, slideInRight, fadeIn } from '../../core/animations/animations';
import { COMPANY } from '../../core/data/company.data';

/**
 * Full-screen cinematic hero with floating gold particles, an animated
 * headline and a parallax luxury event image.
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, ParallaxDirective],
  animations: [fadeUp, slideInRight, fadeIn],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  readonly company = COMPANY;

  /** Pre-computed particle field — varied size/position/delay for depth. */
  readonly particles = Array.from({ length: 28 }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    size: 2 + ((i * 7) % 6),
    delay: (i % 10) * 0.6,
    duration: 5 + (i % 6),
    opacity: 0.2 + ((i % 5) * 0.12),
  }));
}
