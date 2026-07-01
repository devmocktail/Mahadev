import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';

import { HeroComponent } from '../../components/hero/hero.component';
import { MarqueeComponent } from '../../components/marquee/marquee.component';
import { AboutComponent } from '../../components/about/about.component';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { GallerySectionComponent } from '../../components/gallery-section/gallery-section.component';
import { WhyChooseComponent } from '../../components/why-choose/why-choose.component';
import { TestimonialsSectionComponent } from '../../components/testimonials-section/testimonials-section.component';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';
import { FaqSectionComponent } from '../../components/faq-section/faq-section.component';
import { ContactSectionComponent } from '../../components/contact-section/contact-section.component';
import { SeoService } from '../../core/services/seo.service';

/** Home page — the cinematic single-scroll experience. */
@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroComponent,
    MarqueeComponent,
    AboutComponent,
    ServicesSectionComponent,
    GallerySectionComponent,
    WhyChooseComponent,
    TestimonialsSectionComponent,
    BookingFormComponent,
    FaqSectionComponent,
    ContactSectionComponent,
  ],
  template: `
    <app-hero />
    <app-marquee />
    <app-about />
    <app-services-section [limit]="6" />
    <app-gallery-section [limit]="8" />
    <app-why-choose />
    <app-testimonials-section />
    <app-booking-form />
    <app-faq-section />
    <app-contact-section />
  `,
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Mahadev Eventz | We Make Your Moments Unforgettable',
      description:
        'Premium luxury event decoration & planning. Balloon & flower decoration, birthdays, anniversaries, proposals, surprises and festivals. Book Mahadev Eventz today.',
    });
  }
}
