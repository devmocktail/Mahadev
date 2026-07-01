import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { PageBannerComponent } from '../../shared/components/page-banner/page-banner.component';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { WhyChooseComponent } from '../../components/why-choose/why-choose.component';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-services-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageBannerComponent, ServicesSectionComponent, WhyChooseComponent, BookingFormComponent],
  template: `
    <app-page-banner
      titleLead="Our"
      titleAccent="Services"
      subtitle="A complete suite of premium decoration and event-planning services, tailored to every occasion."
      current="Services"
    />
    <app-services-section />
    <app-why-choose />
    <app-booking-form />
  `,
})
export class ServicesComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Our Services | Mahadev Eventz',
      description:
        'Explore Mahadev Eventz services: balloon & flower decoration, birthdays, anniversaries, proposals, baby showers, corporate events and more.',
    });
  }
}
