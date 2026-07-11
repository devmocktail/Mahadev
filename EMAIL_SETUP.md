# Booking form → email (Web3Forms)

The booking form sends **client-side via Web3Forms** — free, no subscription,
no account/password, no server. It works locally and on Netlify. Every
submission is delivered to **S.somith07@gmail.com**, with the customer's address
as **Reply-To** (just hit *Reply* to answer them).

## Setup (30 seconds)

1. Go to **https://web3forms.com**
2. In "Create Access Key", enter the receiving email: **S.somith07@gmail.com**
3. Web3Forms instantly emails you an **Access Key** (a UUID). No login needed.
4. Paste it into
   [`src/app/core/data/contact-form.config.ts`](src/app/core/data/contact-form.config.ts):

   ```ts
   export const CONTACT_FORM = {
     web3formsAccessKey: 'paste-your-access-key-here',
     toEmail: 'S.somith07@gmail.com',
   } as const;
   ```
5. Commit + push. Netlify redeploys and the form starts emailing.

> Until the key is added, the form gracefully falls back to opening the
> visitor's mail app with a pre-filled draft, so no enquiry is lost.

## What the customer sees
A gold **"Booking Received!"** popup with a reference number.

## What arrives in the inbox
A clean email listing: Reference, Name, Phone, Email, Event Type, Event Date,
Location, Budget and Message — with **Reply-To** set to the customer.

## Free tier
Web3Forms free plan: **250 submissions / month**, unlimited forms. No credit card.

---

### Other free options (if you ever want to switch)
- **Netlify Forms** — built into your hosting (100 submissions/mo free); set the
  notification email in the Netlify dashboard. No third-party account.
- **FormSubmit.co** — zero signup; point the form at the email address directly.
