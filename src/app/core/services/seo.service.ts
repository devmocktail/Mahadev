import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const DEFAULTS: Required<SeoConfig> = {
  title: 'Mahadev Eventz | Premium Event Decoration & Planning',
  description:
    'Mahadev Eventz creates unforgettable celebrations with premium balloon & flower decoration, birthdays, anniversaries, proposals and festival events.',
  image: '/assets/images/og-cover.svg',
  url: 'https://mahadeveventz.com/',
};

/** Centralised SEO / social meta-tag management per route. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(config: SeoConfig): void {
    const c = { ...DEFAULTS, ...config };

    this.title.setTitle(c.title);
    this.meta.updateTag({ name: 'description', content: c.description });

    this.meta.updateTag({ property: 'og:title', content: c.title });
    this.meta.updateTag({ property: 'og:description', content: c.description });
    this.meta.updateTag({ property: 'og:image', content: c.image });
    this.meta.updateTag({ property: 'og:url', content: c.url });

    this.meta.updateTag({ name: 'twitter:title', content: c.title });
    this.meta.updateTag({ name: 'twitter:description', content: c.description });
    this.meta.updateTag({ name: 'twitter:image', content: c.image });
  }
}
