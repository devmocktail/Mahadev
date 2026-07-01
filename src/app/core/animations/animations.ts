import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  state,
  keyframes,
} from '@angular/animations';

/** Fade + rise used for hero text and section entrances. */
export const fadeUp = trigger('fadeUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(36px)' }),
    animate('700ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);

/** Simple opacity fade for images / overlays. */
export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('900ms ease', style({ opacity: 1 })),
  ]),
]);

/** Scale-in pop, used for badges and popups. */
export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.85)' }),
    animate('500ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition(':leave', [
    animate('250ms ease', style({ opacity: 0, transform: 'scale(0.9)' })),
  ]),
]);

/** Slide in from the right (hero image). */
export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(60px)' }),
    animate('900ms 200ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
]);

/** Staggered children reveal for grids/lists. */
export const staggerList = trigger('staggerList', [
  transition(':enter', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(28px)' }),
        stagger(90, [
          animate('600ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
        ]),
      ],
      { optional: true },
    ),
  ]),
]);

/** Expand/collapse for FAQ accordion. */
export const expandCollapse = trigger('expandCollapse', [
  state('collapsed', style({ height: '0', opacity: 0, overflow: 'hidden' })),
  state('expanded', style({ height: '*', opacity: 1 })),
  transition('collapsed <=> expanded', [animate('320ms cubic-bezier(0.22, 1, 0.36, 1)')]),
]);

/** Route/page transition fade. */
export const routeFade = trigger('routeFade', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('400ms ease', style({ opacity: 1 })),
  ]),
]);

/** Attention pulse used on featured icons. */
export const pulse = trigger('pulse', [
  transition(':enter', [
    animate(
      '1.2s ease',
      keyframes([
        style({ transform: 'scale(1)', offset: 0 }),
        style({ transform: 'scale(1.08)', offset: 0.5 }),
        style({ transform: 'scale(1)', offset: 1 }),
      ]),
    ),
  ]),
]);
