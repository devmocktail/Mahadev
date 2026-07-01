import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BookingRequest } from '../models';

/**
 * Booking submission service.
 * In production this would POST to a backend / CRM. Here it simulates an
 * async network call so the UI flow (loading → success popup) is realistic.
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  submit(request: BookingRequest): Observable<{ success: true; reference: string }> {
    // Deterministic, human-friendly reference based on name + date.
    const reference =
      'MHD-' +
      (request.name.replace(/\s+/g, '').slice(0, 3).toUpperCase() || 'EVT') +
      '-' +
      request.eventDate.replace(/-/g, '').slice(2);

    return of({ success: true as const, reference }).pipe(delay(1400));
  }
}
