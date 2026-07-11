import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import emailjs from '@emailjs/browser';
import { BookingRequest } from '../models';
import { EMAILJS } from '../data/emailjs.config';

export interface BookingResponse {
  success: true;
  reference: string;
}

/**
 * Booking submission service.
 * Sends the enquiry via EmailJS (client-side) to EMAILJS.toEmail, with the
 * customer's address as reply-to. Works locally and on any host — no server.
 * Falls back to a mailto draft until the EmailJS template ID is configured.
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  submit(request: BookingRequest): Observable<BookingResponse> {
    const reference = this.buildReference(request);

    const composedMessage = [
      `Event Type : ${request.eventType}`,
      `Event Date : ${request.eventDate}`,
      `Location   : ${request.location}`,
      `Budget     : ${request.budget}`,
      '',
      request.message?.trim() || '(no additional message)',
    ].join('\n');

    const params: Record<string, string> = {
      from_name: request.name,
      reply_to: request.email,
      phone: request.phone,
      to_email: EMAILJS.toEmail,
      event_type: request.eventType,
      event_date: request.eventDate,
      location: request.location,
      budget: request.budget,
      message: composedMessage,
      reference,
      sent_at: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    // Graceful fallback before EmailJS credentials are wired up: open the
    // visitor's mail app with a pre-filled draft so nothing is lost.
    if (EMAILJS.templateId === 'YOUR_BOOKING_TEMPLATE_ID') {
      return from(this.mailtoFallback(request, reference));
    }

    const call = emailjs
      .send(EMAILJS.serviceId, EMAILJS.templateId, params, { publicKey: EMAILJS.publicKey })
      .then(() => ({ success: true as const, reference }));

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
      window.location.href = `mailto:${EMAILJS.toEmail}?subject=${subject}&body=${body}`;
    }
    return Promise.resolve({ success: true as const, reference });
  }
}
