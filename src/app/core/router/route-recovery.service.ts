import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationError, Router } from '@angular/router';

/**
 * Recovers from a failed lazy-route load.
 *
 * Every page is loaded with a dynamic `import()`. If that single request is
 * dropped — routine on a flaky mobile connection, and common in the in-app
 * browsers used by WhatsApp and Instagram — the router emits NavigationError
 * and the outlet stays empty. The app shell (navbar, footer, floating buttons)
 * still renders, so the visitor is left staring at a blank page with no error,
 * no spinner and no way forward but a manual reload.
 *
 * A browser also caches the *rejection* of a failed module import, so simply
 * retrying the same `import()` returns the same failure. A full reload is what
 * actually clears it — and it re-fetches index.html too, which additionally
 * covers the case where a stale cached index.html points at chunk filenames a
 * newer deploy no longer has.
 *
 * So: reload once automatically per URL per tab, and if it still fails, hand
 * the visitor a visible retry instead of a blank screen. The per-URL marker in
 * sessionStorage is what bounds this — it can never become a reload loop.
 */
@Injectable({ providedIn: 'root' })
export class RouteRecoveryService {
  private readonly router = inject(Router);

  /** The URL that failed to load, once automatic recovery has been spent. */
  private readonly failedUrl = signal<string | null>(null);
  /** True when the visitor needs to be shown a retry affordance. */
  readonly failed = computed(() => this.failedUrl() !== null);
  /** Distinguishes "you're offline" from "that didn't load" in the message. */
  readonly offline = signal(false);

  /** Called for every NavigationError. */
  handleError(event: NavigationError): void {
    const url = event.url || '/';

    // Not a missing-chunk problem: reloading would not help, so surface it.
    if (!isChunkLoadError(event.error)) {
      this.failedUrl.set(url);
      return;
    }

    // No point reloading with no connection — wait for the visitor to retry.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.offline.set(true);
      this.failedUrl.set(url);
      return;
    }

    if (this.claimRetry(url)) {
      location.reload();
      return;
    }

    // Automatic recovery already used for this URL in this tab.
    this.failedUrl.set(url);
  }

  /** Called on a successful navigation, so a later failure may retry again. */
  clear(url: string): void {
    this.failedUrl.set(null);
    this.offline.set(false);
    this.releaseRetry(url);
  }

  /**
   * Visitor-initiated retry. Tries an in-app navigation first (cheaper than a
   * reload); if the module registry still has the rejection cached that fails
   * and lands back in `handleError`, which reloads.
   */
  retry(): void {
    const url = this.failedUrl();
    this.failedUrl.set(null);
    this.offline.set(false);

    if (!url) {
      location.reload();
      return;
    }

    // Refresh this URL's automatic-retry budget so the escalation to a reload
    // can happen once more, then stop.
    this.releaseRetry(url);
    this.router.navigateByUrl(url).catch(() => location.reload());
  }

  // -- sessionStorage is per-tab, so a retry budget cannot leak between tabs
  //    or outlive the session. Every access is guarded: Safari throws on
  //    storage access in some private-browsing configurations.

  private key(url: string): string {
    return `mhd:route-retry:${url}`;
  }

  /** Returns true if an automatic retry is still available (and claims it). */
  private claimRetry(url: string): boolean {
    try {
      if (sessionStorage.getItem(this.key(url))) return false;
      sessionStorage.setItem(this.key(url), '1');
      return true;
    } catch {
      // Without storage we cannot bound the retries, so never auto-reload.
      return false;
    }
  }

  private releaseRetry(url: string): void {
    try {
      sessionStorage.removeItem(this.key(url));
    } catch {
      /* storage unavailable — nothing to clean up */
    }
  }
}

/**
 * Whether an error is a failed dynamic `import()`. The message differs per
 * engine, so match all of them: Chrome/Edge, Safari/WebKit, Firefox, and the
 * ChunkLoadError name bundlers use.
 */
function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const name = (error as { name?: string }).name ?? '';
  if (name === 'ChunkLoadError') return true;

  const message = String((error as { message?: string }).message ?? error);
  return (
    /Importing a module script failed/i.test(message) || // Safari / WebKit
    /Failed to fetch dynamically imported module/i.test(message) || // Chrome
    /error loading dynamically imported module/i.test(message) || // Firefox
    /Loading chunk \S+ failed/i.test(message) ||
    /dynamically imported module/i.test(message)
  );
}
