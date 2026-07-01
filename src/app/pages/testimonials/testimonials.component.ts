import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { PageBannerComponent } from '../../shared/components/page-banner/page-banner.component';
import { TestimonialsSectionComponent } from '../../components/testimonials-section/testimonials-section.component';
import { ContactSectionComponent } from '../../components/contact-section/contact-section.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-testimonials-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageBannerComponent, TestimonialsSectionComponent, ContactSectionComponent],
  template: `
    <app-page-banner
      titleLead="Client"
      titleAccent="Testimonials"
      subtitle="The stories and smiles that mean the world to us."
      current="Testimonials"
    />
    <app-testimonials-section />
    <app-contact-section />
  `,
})
export class TestimonialsComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Testimonials | Mahadev Eventz',
      description:
        'Read what our happy clients say about Mahadev Eventz — premium event decoration that exceeds expectations every time.',
    });
  }
}
