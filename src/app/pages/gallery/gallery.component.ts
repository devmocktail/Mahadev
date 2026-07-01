import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { PageBannerComponent } from '../../shared/components/page-banner/page-banner.component';
import { GallerySectionComponent } from '../../components/gallery-section/gallery-section.component';
import { TestimonialsSectionComponent } from '../../components/testimonials-section/testimonials-section.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageBannerComponent, GallerySectionComponent, TestimonialsSectionComponent],
  template: `
    <app-page-banner
      titleLead="Our"
      titleAccent="Gallery"
      subtitle="Browse a curated collection of the celebrations we've designed and delivered."
      current="Gallery"
    />
    <app-gallery-section />
    <app-testimonials-section />
  `,
})
export class GalleryComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Gallery | Mahadev Eventz',
      description:
        'A luxury gallery of birthdays, anniversaries, proposals, balloon & flower decoration, festivals and corporate events by Mahadev Eventz.',
    });
  }
}
