import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import {
  Router,
  RouterOutlet,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ScrollProgressComponent } from './shared/components/scroll-progress/scroll-progress.component';
import { BackToTopComponent } from './shared/components/back-to-top/back-to-top.component';
import { FloatingActionsComponent } from './shared/components/floating-actions/floating-actions.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ScrollService } from './core/services/scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ScrollProgressComponent,
    BackToTopComponent,
    FloatingActionsComponent,
    LoaderComponent,
  ],
  template: `
    <app-scroll-progress />
    <app-navbar />

    <!-- min-height keeps the footer below the fold while a lazy route loads,
         so it never flashes up under the navbar. -->
    <main id="top" class="min-h-[calc(100vh-5rem)]">
      @if (routeLoading()) {
        <div class="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-ink">
          <app-loader label="Loading" />
        </div>
      }
      <router-outlet />
    </main>

    <app-footer />
    <app-floating-actions />
    <app-back-to-top />
  `,
})
export class App implements OnInit {
  private readonly scroll = inject(ScrollService);
  private readonly router = inject(Router);

  /** True while a (lazy) route is loading — drives the in-page loader and
   *  guarantees the footer never appears before the page content. */
  readonly routeLoading = signal(true);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.routeLoading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.routeLoading.set(false);
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    // Disable browser scroll restoration (belt-and-suspenders with the inline
    // <head> script) and start at the top.
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    this.scroll.init();
  }
}
