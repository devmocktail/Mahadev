/**
 * Contact / booking form delivery config — Web3Forms.
 *
 * Web3Forms is free (no subscription, no account/password) and works entirely
 * client-side, so it runs locally and on Netlify with no server.
 *
 * Setup (30 seconds):
 *   1. Go to https://web3forms.com
 *   2. Enter the receiving email: S.somith07@gmail.com
 *   3. They email you an "Access Key" instantly — paste it below.
 *   (No dashboard login or password needed.)
 *
 * Until the key is set, the form falls back to opening the visitor's mail app
 * with a pre-filled draft so nothing is lost.
 */
export const CONTACT_FORM = {
  web3formsAccessKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
  /** Fallback recipient used only for the mailto draft before the key is set. */
  toEmail: 'S.somith07@gmail.com',
} as const;
