import { Injectable } from '@angular/core';
import { SERVICES } from '../data/services.data';
import { GALLERY, GALLERY_CATEGORIES } from '../data/gallery.data';
import { TESTIMONIALS } from '../data/testimonials.data';
import { FEATURES, STATS, FAQS } from '../data/features.data';
import { COMPANY } from '../data/company.data';

/**
 * Read-only facade over the static content datasets.
 * Keeps components decoupled from raw data file locations and makes it
 * trivial to swap to an HTTP-backed source later.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  readonly company = COMPANY;
  readonly services = SERVICES;
  readonly gallery = GALLERY;
  readonly galleryCategories = GALLERY_CATEGORIES;
  readonly testimonials = TESTIMONIALS;
  readonly features = FEATURES;
  readonly stats = STATS;
  readonly faqs = FAQS;

  getService(slug: string) {
    return this.services.find((s) => s.slug === slug);
  }
}
