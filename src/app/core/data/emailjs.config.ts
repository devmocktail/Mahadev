/**
 * EmailJS configuration for the booking / contact form.
 *
 * The form sends client-side via EmailJS (no server needed) — it works both
 * locally and on Netlify. Submissions are delivered to `toEmail`.
 *
 * Setup (one time, ~5 min):
 *   1. Sign in at https://www.emailjs.com (free: 200 emails/month).
 *   2. Email Services → connect the Gmail that should SEND the mail → copy Service ID.
 *   3. Email Templates → Create New Template, set "To Email" = {{to_email}},
 *      "Reply To" = {{reply_to}}, and paste the HTML from EMAIL_TEMPLATE.md →
 *      copy the Template ID.
 *   4. Account → API Keys → copy the Public Key.
 *   5. Replace the three IDs below.
 *
 * NOTE: the Public Key is meant to be public (client-side) — safe to commit.
 * If `templateId` is left as the placeholder, the form gracefully falls back
 * to opening the visitor's mail app with a pre-filled draft.
 */
export const EMAILJS = {
  serviceId: 'service_w1hogks',
  templateId: 'YOUR_BOOKING_TEMPLATE_ID',
  publicKey: 'b7cy6FrjVeMjH6HJ0',
  /** Where booking enquiries are delivered. */
  toEmail: 'S.somith07@gmail.com',
} as const;
