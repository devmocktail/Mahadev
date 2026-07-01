import { Routes } from '@angular/router';

/**
 * Application routes — every page is lazy-loaded via `loadComponent`
 * for optimal initial bundle size and fast first paint.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Mahadev Eventz | We Make Your Moments Unforgettable',
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
    title: 'About Us | Mahadev Eventz',
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services/services.component').then((m) => m.ServicesComponent),
    title: 'Our Services | Mahadev Eventz',
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then((m) => m.GalleryComponent),
    title: 'Gallery | Mahadev Eventz',
  },
  {
    path: 'testimonials',
    loadComponent: () =>
      import('./pages/testimonials/testimonials.component').then((m) => m.TestimonialsComponent),
    title: 'Testimonials | Mahadev Eventz',
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking.component').then((m) => m.BookingComponent),
    title: 'Book Your Event | Mahadev Eventz',
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact Us | Mahadev Eventz',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page Not Found | Mahadev Eventz',
  },
];
