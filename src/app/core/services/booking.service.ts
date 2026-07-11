import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BookingRequest } from '../models';

/**
 * Booking submission service.
 * Simulates an async submission so the UI flow (loading → success popup) is
 * realistic. Wire this up to a real backend / email service when ready.
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  submit(request: BookingRequest): Observable<{ success: true; reference: string }> {
    const reference =
      'MHD-' +
      (request.name.replace(/\s+/g, '').slice(0, 3).toUpperCase() || 'EVT') +
      '-' +
      request.eventDate.replace(/-/g, '').slice(2);

    return of({ success: true as const, reference }).pipe(delay(1400));
  }
}
