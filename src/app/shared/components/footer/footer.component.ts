import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { COMPANY } from '../../../core/data/company.data';
import { SERVICES } from '../../../core/data/services.data';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LogoComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly company = COMPANY;
  readonly year = new Date().getFullYear();

  /** First six services for the footer quick-links column. */
  readonly footerServices = SERVICES.slice(0, 6);

  readonly quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Contact', path: '/contact' },
  ];

  get whatsappLink(): string {
    return `https://wa.me/${this.company.phoneIntl}?text=${encodeURIComponent(this.company.whatsappMessage)}`;
  }
}
