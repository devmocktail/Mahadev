import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ScrollProgressComponent } from './shared/components/scroll-progress/scroll-progress.component';
import { BackToTopComponent } from './shared/components/back-to-top/back-to-top.component';
import { FloatingActionsComponent } from './shared/components/floating-actions/floating-actions.component';
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
  ],
  template: `
    <app-scroll-progress />
    <app-navbar />

    <main id="top">
      <router-outlet />
    </main>

    <app-footer />
    <app-floating-actions />
    <app-back-to-top />
  `,
})
export class App implements OnInit {
  private readonly scroll = inject(ScrollService);

  ngOnInit(): void {
    this.scroll.init();
  }
}
