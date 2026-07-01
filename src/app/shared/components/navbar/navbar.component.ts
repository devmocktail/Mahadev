import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LogoComponent } from '../logo/logo.component';
import { ButtonComponent } from '../button/button.component';
import { ScrollService } from '../../../core/services/scroll.service';
import { COMPANY } from '../../../core/data/company.data';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, LogoComponent, ButtonComponent],
  animations: [
    // Backdrop fade
    trigger('backdrop', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms ease', style({ opacity: 1 }))]),
      transition(':leave', [animate('250ms ease', style({ opacity: 0 }))]),
    ]),
    // Drawer slide-in from the right + staggered links
    trigger('drawer', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('380ms cubic-bezier(0.22, 1, 0.36, 1)', style({ transform: 'translateX(0)' })),
        query(
          '.drawer-link, .drawer-cta',
          [
            style({ opacity: 0, transform: 'translateX(24px)' }),
            stagger(55, [
              animate('320ms ease', style({ opacity: 1, transform: 'translateX(0)' })),
            ]),
          ],
          { optional: true },
        ),
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.22, 1, 0.36, 1)', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly scroll = inject(ScrollService);

  readonly company = COMPANY;
  readonly scrolled = this.scroll.scrolled;
  readonly mobileOpen = signal(false);

  readonly links: NavLink[] = [
    { label: 'Home', path: '/', icon: 'fa-solid fa-house' },
    { label: 'About', path: '/about', icon: 'fa-solid fa-star' },
    { label: 'Services', path: '/services', icon: 'fa-solid fa-wand-magic-sparkles' },
    { label: 'Gallery', path: '/gallery', icon: 'fa-solid fa-images' },
    { label: 'Testimonials', path: '/testimonials', icon: 'fa-solid fa-quote-left' },
    { label: 'Contact', path: '/contact', icon: 'fa-solid fa-phone' },
  ];

  constructor() {
    // Lock body scroll while the drawer is open.
    effect(() => {
      if (typeof document === 'undefined') return;
      document.body.style.overflow = this.mobileOpen() ? 'hidden' : '';
    });
  }

  get whatsappLink(): string {
    return `https://wa.me/${this.company.phoneIntl}?text=${encodeURIComponent(this.company.whatsappMessage)}`;
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
