import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { BookingRequest } from '../models';

export interface BookingResponse {
  success: true;
  reference: string;
}

/**
 * Booking submission service.
 * POSTs the form to the Netlify serverless function, which emails the
 * enquiry to the company inbox (reply-to = the customer). Throws on any
 * non-success response so the UI can show an error state.
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly endpoint = '/.netlify/functions/send-booking';

  submit(request: BookingRequest): Observable<BookingResponse> {
    const call = fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}) as Record<string, unknown>);
      if (!res.ok || !data['success']) {
        const msg =
          (data['error'] as string) ||
          'We could not send your request right now. Please call us or try again.';
        throw new Error(msg);
      }
      return { success: true as const, reference: data['reference'] as string };
    });

    return from(call);
  }
}
