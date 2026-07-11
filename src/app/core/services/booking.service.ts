import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { BookingRequest } from '../models';
import { CONTACT_FORM } from '../data/contact-form.config';

export interface BookingResponse {
  success: true;
  reference: string;
}

/**
 * Booking submission service.
 * Sends the enquiry via Web3Forms (free, client-side) to the email tied to the
 * access key. Reply-To is the customer's address so a reply reaches them.
 * Falls back to a mailto draft until the access key is configured.
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly endpoint = 'https://api.web3forms.com/submit';

  submit(request: BookingRequest): Observable<BookingResponse> {
    const reference = this.buildReference(request);

    // Before the free access key is added, keep the submission from being lost.
    if (CONTACT_FORM.web3formsAccessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      return from(this.mailtoFallback(request, reference));
    }

    const payload = {
      access_key: CONTACT_FORM.web3formsAccessKey,
      subject: `New Booking Enquiry — ${request.eventType} (${request.name})`,
      from_name: 'Mahadev Eventz Website',
      replyto: request.email,
      // These labelled fields become the email body.
      Reference: reference,
      Name: request.name,
      Phone: request.phone,
      Email: request.email,
      'Event Type': request.eventType,
      'Event Date': request.eventDate,
      Location: request.location,
      Budget: request.budget,
      Message: request.message?.trim() || '(no additional message)',
    };

    const call = fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok || !data['success']) {
        throw new Error(
          (data['message'] as string) ||
            'We could not send your request right now. Please call us or try again.',
        );
      }
      return { success: true as const, reference };
    });

    return from(call);
  }

  private buildReference(request: BookingRequest): string {
    const initials = request.name.replace(/\s+/g, '').slice(0, 3).toUpperCase() || 'EVT';
    return `MHD-${initials}-${request.eventDate.replace(/-/g, '').slice(2)}`;
  }

  private mailtoFallback(request: BookingRequest, reference: string): Promise<BookingResponse> {
    const subject = encodeURIComponent(`Booking Enquiry — ${request.eventType} (${request.name})`);
    const body = encodeURIComponent(
      [
        `Reference: ${reference}`,
        `Name: ${request.name}`,
        `Phone: ${request.phone}`,
        `Email: ${request.email}`,
        `Event Type: ${request.eventType}`,
        `Event Date: ${request.eventDate}`,
        `Location: ${request.location}`,
        `Budget: ${request.budget}`,
        '',
        request.message || '',
      ].join('\n'),
    );
    if (typeof window !== 'undefined') {
      window.location.href = `mailto:${CONTACT_FORM.toEmail}?subject=${subject}&body=${body}`;
    }
    return Promise.resolve({ success: true as const, reference });
  }
}
