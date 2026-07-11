# Booking form → email setup (EmailJS)

The booking form sends **client-side via EmailJS** (no server, works locally and
on Netlify). Every submission is delivered to **S.somith07@gmail.com** with the
customer's address as **Reply-To**, so you just hit *Reply* to answer them.

Until you paste your **Template ID** into
[`src/app/core/data/emailjs.config.ts`](src/app/core/data/emailjs.config.ts),
the form falls back to opening the visitor's mail app with a pre-filled draft.

---

## 1. EmailJS account & service

1. Sign in at https://www.emailjs.com (free: 200 emails/month).
2. **Email Services → Add New Service → Gmail** → connect the Gmail that should
   *send* the mail → copy the **Service ID**.
3. **Account → API Keys** → copy the **Public Key**.

> You can reuse an existing EmailJS service/public key across projects.

## 2. Create the template

**Email Templates → Create New Template.** Set these fields:

- **To Email:** `{{to_email}}`
- **From Name:** `Mahadev Eventz Website`
- **Reply To:** `{{reply_to}}`
- **Subject:** `New Booking Enquiry — {{event_type}} ({{from_name}})`

Variables used: `{{from_name}}`, `{{reply_to}}`, `{{phone}}`, `{{event_type}}`,
`{{event_date}}`, `{{location}}`, `{{budget}}`, `{{message}}`, `{{reference}}`,
`{{sent_at}}`, `{{to_email}}`.

Switch the content editor to **Code / HTML** and paste:

```html
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light dark" />
  <title>New Booking Enquiry</title>
  <style>
    @media only screen and (max-width:600px) {
      .wrap { padding:16px 0 !important; }
      .card { width:100% !important; border-radius:0 !important; }
      .pad  { padding:24px 22px !important; }
      .padh { padding:22px 22px !important; }
      .h1   { font-size:21px !important; line-height:1.25 !important; }
      .lbl, .val { display:block !important; width:100% !important; }
      .lbl  { padding-bottom:2px !important; }
    }
    a { text-decoration:none; }
  </style>
</head>
<body style="margin:0;padding:0;width:100%;background:#0b0b0b;font-family:'Segoe UI',Arial,sans-serif;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    New booking enquiry from {{from_name}} — tap to read and reply.
  </div>

  <table role="presentation" class="wrap" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0b0b0b;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#141416;border:1px solid rgba(212,175,55,0.22);border-radius:18px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td class="padh" style="background:#d4af37;background:linear-gradient(135deg,#f6efcb,#d4af37 55%,#ae8c24);padding:28px 36px;">
              <p style="margin:0;font-size:12px;letter-spacing:3px;color:rgba(0,0,0,0.55);font-weight:700;">NEW BOOKING ENQUIRY</p>
              <h1 class="h1" style="margin:6px 0 0;font-size:26px;color:#0b0b0b;font-weight:800;line-height:1.2;font-family:Georgia,'Times New Roman',serif;">Mahadev Eventz</h1>
            </td>
          </tr>
          <!-- Reference -->
          <tr>
            <td class="pad" style="padding:28px 36px 4px;">
              <span style="display:inline-block;background:#211b09;border:1px solid rgba(212,175,55,0.35);color:#d4af37;font-size:13px;font-weight:700;padding:6px 14px;border-radius:999px;">Reference: {{reference}}</span>
            </td>
          </tr>
          <!-- Details -->
          <tr>
            <td class="pad" style="padding:16px 36px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td class="lbl" style="padding:10px 0 2px;font-size:11px;letter-spacing:2px;color:#c9a94a;font-weight:700;">NAME</td></tr>
                <tr><td class="val" style="padding:0 0 12px;font-size:17px;color:#ffffff;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">{{from_name}}</td></tr>

                <tr><td class="lbl" style="padding:14px 0 2px;font-size:11px;letter-spacing:2px;color:#c9a94a;font-weight:700;">EMAIL</td></tr>
                <tr><td class="val" style="padding:0 0 12px;font-size:15px;word-break:break-all;border-bottom:1px solid rgba(255,255,255,0.06);"><a href="mailto:{{reply_to}}" style="color:#e5c76b;">{{reply_to}}</a></td></tr>

                <tr><td class="lbl" style="padding:14px 0 2px;font-size:11px;letter-spacing:2px;color:#c9a94a;font-weight:700;">PHONE</td></tr>
                <tr><td class="val" style="padding:0 0 12px;font-size:15px;border-bottom:1px solid rgba(255,255,255,0.06);"><a href="tel:{{phone}}" style="color:#e5c76b;">{{phone}}</a></td></tr>

                <tr><td class="lbl" style="padding:14px 0 2px;font-size:11px;letter-spacing:2px;color:#c9a94a;font-weight:700;">EVENT TYPE</td></tr>
                <tr><td class="val" style="padding:0 0 12px;font-size:15px;color:#e6e6e6;border-bottom:1px solid rgba(255,255,255,0.06);">{{event_type}}</td></tr>

                <tr><td class="lbl" style="padding:14px 0 2px;font-size:11px;letter-spacing:2px;color:#c9a94a;font-weight:700;">EVENT DATE</td></tr>
                <tr><td class="val" style="padding:0 0 12px;font-size:15px;color:#e6e6e6;border-bottom:1px solid rgba(255,255,255,0.06);">{{event_date}}</td></tr>

                <tr><td class="lbl" style="padding:14px 0 2px;font-size:11px;letter-spacing:2px;color:#c9a94a;font-weight:700;">LOCATION</td></tr>
                <tr><td class="val" style="padding:0 0 12px;font-size:15px;color:#e6e6e6;border-bottom:1px solid rgba(255,255,255,0.06);">{{location}}</td></tr>

                <tr><td class="lbl" style="padding:14px 0 2px;font-size:11px;letter-spacing:2px;color:#c9a94a;font-weight:700;">BUDGET</td></tr>
                <tr><td class="val" style="padding:0 0 16px;font-size:15px;color:#e6e6e6;">{{budget}}</td></tr>
              </table>

              <p style="margin:8px 0 6px;font-size:11px;letter-spacing:2px;color:#c9a94a;font-weight:700;">MESSAGE</p>
              <div style="background:#1d1d20;border-left:3px solid #d4af37;border-radius:8px;padding:16px 18px;">
                <p style="margin:0;font-size:15px;line-height:1.6;color:#e6e6e6;white-space:pre-wrap;word-break:break-word;">{{message}}</p>
              </div>

              <!-- Bulletproof reply button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:26px;">
                <tr>
                  <td align="center" bgcolor="#d4af37" style="border-radius:30px;">
                    <a href="mailto:{{reply_to}}?subject=Re:%20Your%20Mahadev%20Eventz%20Enquiry" style="display:inline-block;background:#d4af37;color:#0b0b0b;font-weight:700;font-size:14px;padding:14px 28px;border-radius:30px;">Reply to {{from_name}} &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td class="pad" style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);">Sent {{sent_at}} &middot; Mahadev Eventz — We Make Your Moments Unforgettable</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## 3. Plug the keys in

Open [`src/app/core/data/emailjs.config.ts`](src/app/core/data/emailjs.config.ts)
and set the three IDs (the recipient is already `S.somith07@gmail.com`):

```ts
export const EMAILJS = {
  serviceId: 'service_xxxxxxx',
  templateId: 'template_xxxxxxx',
  publicKey: 'xxxxxxxxxxxxxxxx',
  toEmail: 'S.somith07@gmail.com',
} as const;
```

Commit + push. Once Netlify redeploys, every booking lands in
**S.somith07@gmail.com** with the branded template above, and the customer sees
the gold "Booking Received!" popup.

### Why it's phone-friendly
- Fluid table (`width:100%; max-width:600px`) — never overflows a narrow screen.
- Media-query overrides shrink padding/headings and stack label/value under 600px.
- Bulletproof reply button (table cell with `bgcolor`) renders in Outlook too.
- `word-break` on email/message so long strings don't force horizontal scroll.
- Solid-color fallback behind the gold gradient header for clients that drop gradients.
