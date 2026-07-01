import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';

import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { RippleDirective } from '../../core/directives/ripple.directive';
import { BookingService } from '../../core/services/booking.service';
import { SERVICES } from '../../core/data/services.data';
import { scaleIn } from '../../core/animations/animations';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SectionHeaderComponent, RippleDirective],
  animations: [scaleIn],
  templateUrl: './booking-form.component.html',
})
export class BookingFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly bookingService = inject(BookingService);

  readonly eventTypes = SERVICES.map((s) => s.title);
  readonly budgets = [
    'Under ₹10,000',
    '₹10,000 – ₹25,000',
    '₹25,000 – ₹50,000',
    '₹50,000 – ₹1,00,000',
    'Above ₹1,00,000',
  ];

  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly reference = signal('');

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    email: ['', [Validators.required, Validators.email]],
    eventType: ['', Validators.required],
    eventDate: ['', Validators.required],
    location: ['', Validators.required],
    budget: ['', Validators.required],
    message: [''],
  });

  /** Convenience accessor for template error checks. */
  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.bookingService.submit(this.form.getRawValue()).subscribe((res) => {
      this.submitting.set(false);
      this.reference.set(res.reference);
      this.success.set(true);
    });
  }

  closeSuccess(): void {
    this.success.set(false);
    this.form.reset();
  }
}
