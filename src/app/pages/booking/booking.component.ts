import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { PageBannerComponent } from '../../shared/components/page-banner/page-banner.component';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';
import { ContactSectionComponent } from '../../components/contact-section/contact-section.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageBannerComponent, BookingFormComponent, ContactSectionComponent],
  template: `
    <app-page-banner
      titleLead="Book Your"
      titleAccent="Event"
      subtitle="Tell us about your celebration and we'll craft a bespoke proposal within hours."
      current="Booking"
    />
    <app-booking-form />
    <app-contact-section />
  `,
})
export class BookingComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Book Your Event | Mahadev Eventz',
      description:
        'Book Mahadev Eventz for your next celebration. Premium balloon & flower decoration, birthdays, anniversaries, proposals and more.',
    });
  }
}
