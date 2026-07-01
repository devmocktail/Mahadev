import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { PageBannerComponent } from '../../shared/components/page-banner/page-banner.component';
import { ContactSectionComponent } from '../../components/contact-section/contact-section.component';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageBannerComponent, ContactSectionComponent, BookingFormComponent],
  template: `
    <app-page-banner
      titleLead="Contact"
      titleAccent="Us"
      subtitle="We're just a call, message or click away. Let's start planning."
      current="Contact"
    />
    <app-contact-section />
    <app-booking-form />
  `,
})
export class ContactComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Contact Us | Mahadev Eventz',
      description:
        'Get in touch with Mahadev Eventz. Call 9030630508, WhatsApp us, or send a message to plan your premium celebration.',
    });
  }
}
