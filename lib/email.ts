import { Resend } from "resend";

const FROM_ADDRESS = "AZEEL NEWS <noreply@azeelnews.in>";

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

async function send(to: string, subject: string, html: string) {
  const client = getClient();
  if (!client) {
    // Dev-safe fallback: no RESEND_API_KEY configured, so log instead of
    // failing. Set RESEND_API_KEY in production to send real email.
    console.log(`[email:dev-fallback] to=${to} subject="${subject}"\n${html}`);
    return;
  }
  await client.emails.send({ from: FROM_ADDRESS, to, subject, html });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await send(
    to,
    "Reset your AZEEL NEWS password",
    `<p>We received a request to reset your password.</p>
     <p><a href="${resetUrl}">Click here to set a new password</a>. This link expires in 1 hour.</p>
     <p>If you didn't request this, you can safely ignore this email.</p>`
  );
}

export async function sendNewsletterEmail(to: string, subject: string, bodyHtml: string) {
  await send(to, subject, `<div>${bodyHtml}</div>`);
}
