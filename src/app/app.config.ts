import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { IdlePreloadStrategy } from './core/router/idle-preload.strategy';

/**
 * Root application configuration.
 *
 * - Zoneless change detection: every component is OnPush and state lives in
 *   signals, so Angular re-renders on signal writes and template event
 *   bindings instead of on every patched browser callback. This also drops
 *   zone.js from the bundle entirely.
 * - Animations load asynchronously, keeping the animation engine off the
 *   critical path for first paint.
 * - Routes preload once the browser is genuinely idle (see
 *   IdlePreloadStrategy), so navigation after first paint is instant without
 *   route chunks stealing bandwidth from the images on screen.
 * - `scrollPositionRestoration: 'top'` lets the router own scroll position;
 *   nothing else in the app needs to fight it.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withPreloading(IdlePreloadStrategy),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
  ],
};
