import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';

/** How long to wait for an idle slot before preloading anyway. */
const IDLE_TIMEOUT_MS = 2500;

interface NetworkInformation {
  readonly effectiveType?: string;
  readonly saveData?: boolean;
}

/**
 * Preloads lazy routes, but only once the browser is idle.
 *
 * `PreloadAllModules` starts downloading every route chunk the moment the
 * first navigation finishes — which is exactly when the page is still fetching
 * the images the visitor is actually looking at. Route chunks then compete for
 * bandwidth and thumbnails crawl in as you scroll.
 *
 * Waiting for `requestIdleCallback` keeps navigation instant without ever
 * starving the visible content. Preloading is skipped entirely on 2G or when
 * the visitor has asked to save data.
 */
@Injectable({ providedIn: 'root' })
export class IdlePreloadStrategy implements PreloadingStrategy {
  preload(_route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (this.shouldSkip()) return EMPTY;

    return new Observable((subscriber) => {
      let cancelled = false;
      let handle: number | undefined;

      const start = (): void => {
        if (cancelled) return;
        load().subscribe(subscriber);
      };

      if (typeof requestIdleCallback === 'function') {
        handle = requestIdleCallback(start, { timeout: IDLE_TIMEOUT_MS });
      } else {
        handle = setTimeout(start, IDLE_TIMEOUT_MS) as unknown as number;
      }

      return () => {
        cancelled = true;
        if (handle === undefined) return;
        if (typeof cancelIdleCallback === 'function') cancelIdleCallback(handle);
        else clearTimeout(handle);
      };
    });
  }

  /** Don't spend someone else's data plan on routes they may never visit. */
  private shouldSkip(): boolean {
    if (typeof navigator === 'undefined') return true;
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (!connection) return false;
    if (connection.saveData) return true;
    return connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
  }
}
