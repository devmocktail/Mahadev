const nodemailer = require('nodemailer');

/**
 * Netlify serverless function: receives a booking/contact submission from the
 * website form and emails it to the company inbox.
 *
 *   TO       = CONTACT_TO env var (defaults to S.somith07@gmail.com)
 *   FROM     = the authenticated Gmail (GMAIL_USER)
 *   REPLY-TO = the customer's email, so a reply goes straight to them
 *
 * Required Netlify environment variables:
 *   GMAIL_USER          - the Gmail address that sends the mail
 *   GMAIL_APP_PASSWORD  - a Gmail "App Password" (needs 2-Step Verification on)
 *   CONTACT_TO          - (optional) recipient inbox; defaults to S.somith07@gmail.com
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function buildReference(name, eventDate) {
  const initials = (name || '').replace(/\s+/g, '').slice(0, 3).toUpperCase() || 'EVT';
  return `MHD-${initials}-${String(eventDate || '').replace(/-/g, '').slice(2)}`;
}

function emailTemplate(d, reference) {
  const rows = [
    ['Name', d.name],
    ['Phone', d.phone],
    ['Email', d.email],
    ['Event Type', d.eventType],
    ['Event Date', d.eventDate],
    ['Location', d.location],
    ['Budget', d.budget],
    ['Message', d.message || '—'],
  ]
    .map(
      ([label, value]) => `
      <tr>
        <td class="label" style="padding:12px 16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a7320;font-weight:bold;vertical-align:top;white-space:nowrap;border-bottom:1px solid #f0e9d2;">${esc(label)}</td>
        <td class="value" style="padding:12px 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1a1a1a;vertical-align:top;border-bottom:1px solid #f0e9d2;">${esc(value)}</td>
      </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <title>New Booking Enquiry</title>
  <style>
    body { margin:0; padding:0; background:#f4f1ea; }
    .wrap { width:100%; background:#f4f1ea; padding:24px 0; }
    .container { width:600px; max-width:600px; margin:0 auto; }
    @media only screen and (max-width:620px) {
      .container { width:100% !important; }
      .px { padding-left:20px !important; padding-right:20px !important; }
      .label, .value { display:block !important; width:100% !important; white-space:normal !important; }
      .label { padding-bottom:2px !important; border-bottom:0 !important; }
      .value { padding-top:0 !important; }
      .h1 { font-size:22px !important; }
      .stack { display:block !important; width:100% !important; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <table role="presentation" class="container" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#0b0b0b 0%,#1a1608 100%);padding:32px 40px;" class="px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:bold;color:#d4af37;">
                Mahadev Eventz
              </td>
              <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c9b56a;">
                New Enquiry
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Title -->
      <tr>
        <td class="px" style="padding:32px 40px 8px;">
          <h1 class="h1" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#111111;">You have a new booking request</h1>
          <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#666666;line-height:1.6;">
            A customer submitted the booking form on your website. Reply to this email to respond to them directly.
          </p>
          <p style="margin:16px 0 0;">
            <span style="display:inline-block;background:#faf6e8;border:1px solid #e7d9a6;color:#8a7320;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;padding:6px 14px;border-radius:999px;">Reference: ${esc(reference)}</span>
          </p>
        </td>
      </tr>

      <!-- Details table -->
      <tr>
        <td class="px" style="padding:20px 40px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #f0e9d2;border-radius:12px;overflow:hidden;">
            ${rows}
          </table>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td class="px" style="padding:24px 40px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="border-radius:999px;background:linear-gradient(135deg,#f6efcb 0%,#d4af37 55%,#ae8c24 100%);">
                <a href="tel:${esc(d.phone)}" style="display:inline-block;padding:12px 26px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0b0b0b;text-decoration:none;">Call ${esc(d.name)}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td class="px" style="padding:28px 40px 36px;">
          <hr style="border:none;border-top:1px solid #eeeae0;margin:0 0 16px;" />
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9a9a9a;line-height:1.6;">
            Sent automatically from the Mahadev Eventz website &bull; We Make Your Moments Unforgettable
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

function textTemplate(d, reference) {
  return [
    'NEW BOOKING ENQUIRY — Mahadev Eventz',
    `Reference: ${reference}`,
    '',
    `Name:       ${d.name}`,
    `Phone:      ${d.phone}`,
    `Email:      ${d.email}`,
    `Event Type: ${d.eventType}`,
    `Event Date: ${d.eventDate}`,
    `Location:   ${d.location}`,
    `Budget:     ${d.budget}`,
    `Message:    ${d.message || '-'}`,
    '',
    'Reply to this email to respond to the customer directly.',
  ].join('\n');
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  // Server-side validation (never trust the client alone).
  const fields = [];
  if (!data.name || data.name.trim().length < 2) fields.push('name');
  if (!PHONE_RE.test(data.phone || '')) fields.push('phone');
  if (!EMAIL_RE.test(data.email || '')) fields.push('email');
  if (!data.eventType) fields.push('eventType');
  if (!data.eventDate) fields.push('eventDate');
  if (!data.location) fields.push('location');
  if (!data.budget) fields.push('budget');
  if (fields.length) {
    return { statusCode: 422, body: JSON.stringify({ error: 'Validation failed', fields }) };
  }

  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  const TO = process.env.CONTACT_TO || 'S.somith07@gmail.com';

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email service is not configured on the server.' }),
    };
  }

  const reference = buildReference(data.name, data.eventDate);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"Mahadev Eventz Website" <${GMAIL_USER}>`,
      to: TO,
      replyTo: `${data.name} <${data.email}>`,
      subject: `New Booking Enquiry — ${data.eventType} (${data.name})`,
      text: textTemplate(data, reference),
      html: emailTemplate(data, reference),
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, reference }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Could not send the email. Please try again later.' }),
    };
  }
};
