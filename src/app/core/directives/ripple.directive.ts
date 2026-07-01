import { Directive, ElementRef, inject, Renderer2 } from '@angular/core';

/**
 * Material-style ripple on click, tuned with a luxury gold tint.
 * Attach to any clickable element: <button appRipple> ... </button>
 */
@Directive({
  selector: '[appRipple]',
  standalone: true,
  host: {
    '(click)': 'spawn($event)',
    style: 'position: relative; overflow: hidden;',
  },
})
export class RippleDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  spawn(event: MouseEvent): void {
    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = this.renderer.createElement('span') as HTMLElement;

    this.renderer.setStyle(ripple, 'position', 'absolute');
    this.renderer.setStyle(ripple, 'width', `${size}px`);
    this.renderer.setStyle(ripple, 'height', `${size}px`);
    this.renderer.setStyle(ripple, 'left', `${event.clientX - rect.left - size / 2}px`);
    this.renderer.setStyle(ripple, 'top', `${event.clientY - rect.top - size / 2}px`);
    this.renderer.setStyle(ripple, 'borderRadius', '50%');
    this.renderer.setStyle(ripple, 'background', 'rgba(255, 255, 255, 0.35)');
    this.renderer.setStyle(ripple, 'transform', 'scale(0)');
    this.renderer.setStyle(ripple, 'pointerEvents', 'none');
    this.renderer.setStyle(ripple, 'animation', 'ripple-spread 600ms ease-out');

    this.renderer.appendChild(host, ripple);
    setTimeout(() => this.renderer.removeChild(host, ripple), 600);
  }
}
