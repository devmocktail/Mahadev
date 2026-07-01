import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { PageBannerComponent } from '../../shared/components/page-banner/page-banner.component';
import { AboutComponent as AboutSection } from '../../components/about/about.component';
import { WhyChooseComponent } from '../../components/why-choose/why-choose.component';
import { FaqSectionComponent } from '../../components/faq-section/faq-section.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageBannerComponent, AboutSection, WhyChooseComponent, FaqSectionComponent],
  template: `
    <app-page-banner
      titleLead="About"
      titleAccent="Mahadev Eventz"
      subtitle="Five years of turning celebrations into cherished, lifelong memories."
      current="About"
    />
    <app-about [showCta]="false" />
    <app-why-choose />
    <app-faq-section />
  `,
})
export class AboutComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'About Us | Mahadev Eventz',
      description:
        'Learn about Mahadev Eventz — five years of premium event decoration and creative planning for birthdays, anniversaries, proposals and festivals.',
    });
  }
}
