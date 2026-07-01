import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { CounterComponent } from '../../shared/components/counter/counter.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { ParallaxDirective } from '../../core/directives/parallax.directive';
import { STATS } from '../../core/data/features.data';
import { COMPANY } from '../../core/data/company.data';

/**
 * Two-column About section with brand story, signature points and a
 * row of animated counters.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SectionHeaderComponent,
    CounterComponent,
    ButtonComponent,
    RevealDirective,
    ParallaxDirective,
  ],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  /** When false, hides the "Discover More" CTA (e.g. on the About page). */
  readonly showCta = input<boolean>(true);

  readonly stats = STATS;
  readonly company = COMPANY;

  readonly pillars = [
    { icon: 'fa-solid fa-gem', text: 'Premium, hand-picked materials' },
    { icon: 'fa-solid fa-palette', text: 'Bespoke, story-driven themes' },
    { icon: 'fa-solid fa-clock', text: 'Punctual, stress-free setups' },
    { icon: 'fa-solid fa-heart', text: 'Obsessive attention to detail' },
  ];
}
