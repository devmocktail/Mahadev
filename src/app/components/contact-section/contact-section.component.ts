import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { COMPANY } from '../../core/data/company.data';

/**
 * Luxury contact section: quick-contact cards, social links, a map
 * placeholder and prominent WhatsApp / Call actions.
 */
@Component({
  selector: 'app-contact-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, RevealDirective],
  templateUrl: './contact-section.component.html',
})
export class ContactSectionComponent {
  readonly company = COMPANY;

  get whatsappLink(): string {
    return `https://wa.me/${this.company.phoneIntl}?text=${encodeURIComponent(this.company.whatsappMessage)}`;
  }

  readonly channels = [
    { icon: 'fa-solid fa-phone', label: 'Call Us', value: COMPANY.phoneDisplay, href: `tel:+${COMPANY.phoneIntl}` },
    { icon: 'fa-solid fa-envelope', label: 'Email Us', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { icon: 'fa-solid fa-location-dot', label: 'Visit Us', value: COMPANY.location, href: '#map' },
  ];
}
