# Booking form → email (Netlify function + Resend)

The booking form POSTs to a **Netlify serverless function** that sends a **fully
custom, branded HTML email** (template lives in
[`netlify/functions/send-booking.js`](netlify/functions/send-booking.js)) to
**S.somith07@gmail.com**, with the customer as **Reply-To** (hit *Reply* to
answer them). Both the function and Resend are **free** — no subscription.

## Setup (one time, ~3 minutes)

1. Sign up at **https://resend.com** — you can sign up **with S.somith07@gmail.com**.
   (Free tier: 3,000 emails/month.)
2. **API Keys → Create API Key** → copy it (looks like `re_xxxxxxxx`).
3. In Netlify → your site → **Site configuration → Environment variables →
   Add a variable**:

   | Key | Value |
   |-----|-------|
   | `RESEND_API_KEY` | the `re_...` key from step 2 |
   | `CONTACT_TO` | `S.somith07@gmail.com` (optional; this is the default) |

4. Netlify → **Deploys → Trigger deploy → Clear cache and deploy site**.

Submit a test booking on the live site — it lands in **S.somith07@gmail.com**
with the gold/black template.

## Why sending "to your own account email" works with no domain
Resend lets you send from `onboarding@resend.dev` to the **email that owns the
Resend account** without verifying a domain. Since you sign up with
S.somith07@gmail.com and mail is delivered there, it works immediately.

> Want emails to come **from** a custom address (e.g. `hello@mahadeveventz.com`)
> or to also send confirmations **to customers**? Verify a domain in Resend
> (Domains → Add), then set the `MAIL_FROM` env var to
> `Mahadev Eventz <hello@yourdomain.com>`.

## Editing the email design
Everything is in [`netlify/functions/send-booking.js`](netlify/functions/send-booking.js)
— the `emailTemplate()` function is plain HTML you can change freely.

## Local testing
Netlify functions only run on Netlify (or via `netlify dev`). With plain
`npm start` (`ng serve`) the send will show an error — that's expected. Test the
real send on the deployed site after adding `RESEND_API_KEY`.
