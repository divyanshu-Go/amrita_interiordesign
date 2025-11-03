// lib/email/sendEmail.js
import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
  APP_URL,
} = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM || !APP_URL) {
  // In dev, you might skip throwing to allow tests, but keep for prod safety
  // throw new Error("Missing email env variables");
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 465),
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * sendResetPasswordEmail(user, rawToken)
 * - user: User document or object with .email and .name
 * - rawToken: the plain token string to embed into link (NOT hashed)
 */
export async function sendResetPasswordEmail(user, rawToken) {
  const resetUrl = `${APP_URL.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(
    rawToken
  )}&email=${encodeURIComponent(user.email)}`;

  const text = `Hi ${user.name || "there"},

We received a request to reset your password for your account.

Click the link below to set a new password (link valid for ${process.env.RESET_TOKEN_EXPIRY_MINUTES || 60} minutes):

${resetUrl}

If you did not request a password reset, you can ignore this email.

Thanks,
The team
`;

  const html = `
    <div style="font-family: system-ui, sans-serif; color: #111;">
      <p>Hi ${user.name || "there"},</p>
      <p>We received a request to reset your password for your account.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 14px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">
          Reset password
        </a>
      </p>
      <p style="font-size:14px;color:#6b7280;">If the button doesn't work, copy and paste the link below into your browser:</p>
      <p style="font-size:13px;color:#6b7280;"><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>Thanks,<br/>Team</p>
    </div>
  `;



  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to: user.email,
    subject: `Reset your password`,
    text,
    html,
  });

  return info;
}
