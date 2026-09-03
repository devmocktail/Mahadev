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
import { RouteRecoveryService } from './core/router/route-recovery.service';

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

      <!-- A dropped chunk request used to leave this area silently blank.
           Never present an empty page: say what happened and offer a way out. -->
      @if (recovery.failed()) {
        <div
          class="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-6 bg-ink px-6 text-center"
          role="alert"
        >
          <span class="grid h-16 w-16 place-content-center rounded-full border border-gold/30 text-gold">
            <i class="fa-solid fa-rotate-right text-2xl"></i>
          </span>
          <div>
            <h2 class="font-display text-2xl text-white">
              {{ recovery.offline() ? 'You appear to be offline' : "This page didn't load" }}
            </h2>
            <p class="mt-2 max-w-sm text-sm text-white/60">
              {{
                recovery.offline()
                  ? 'Check your connection and try again — nothing has been lost.'
                  : 'The connection dropped while loading. Trying again usually fixes it.'
              }}
            </p>
          </div>
          <button
            type="button"
            (click)="recovery.retry()"
            class="rounded-full bg-gold-gradient px-7 py-3 text-sm font-semibold text-ink shadow-gold transition-transform duration-300 hover:-translate-y-0.5"
          >
            Try again
          </button>
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
  readonly recovery = inject(RouteRecoveryService);

  /** True while a (lazy) route is loading — drives the in-page loader and
   *  guarantees the footer never appears before the page content. */
  readonly routeLoading = signal(true);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.routeLoading.set(true);
      } else if (event instanceof NavigationEnd) {
        // Scroll position is handled by the router's `withInMemoryScrolling`.
        this.routeLoading.set(false);
        this.recovery.clear(event.urlAfterRedirects || event.url);
      } else if (event instanceof NavigationError) {
        this.routeLoading.set(false);
        this.recovery.handleError(event);
      } else if (event instanceof NavigationCancel) {
        this.routeLoading.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.scroll.init();
  }
}
