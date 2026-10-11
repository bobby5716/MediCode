const nodemailer = require('nodemailer');

const maskEmail = (value = '') => {
  const [name, domain] = String(value).split('@');
  if (!name || !domain) return '[invalid email]';
  return `${name.slice(0, 1)}***@${domain}`;
};

async function sendOtpEmail({ to, otp, purpose = 'verification' }) {
  const EMAIL_USER = process.env.EMAIL_USER?.trim();
  // Gmail App Passwords are often copied with spaces; remove whitespace safely.
  const EMAIL_PASS = process.env.EMAIL_PASS?.replace(/\s+/g, '');

  console.log(`[EMAIL] Request received for ${maskEmail(to)} (${purpose}).`);

  if (!EMAIL_USER || !EMAIL_PASS) {
    const error = new Error(
      'Email is not configured. Set EMAIL_USER and EMAIL_PASS in backend/.env.'
    );
    error.code = 'EMAIL_NOT_CONFIGURED';
    console.error('[EMAIL] Configuration missing: EMAIL_USER or EMAIL_PASS is empty.');
    throw error;
  }

  const isVerification = purpose === 'verification';
  const subject = isVerification
    ? 'Verify your MediCore email'
    : 'Your MediCore security code';
  const action = isVerification
    ? 'verify your email address'
    : 'complete your request';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  try {
    const info = await transporter.sendMail({
      from: { name: 'MediCore', address: EMAIL_USER },
      to,
      subject,
      text: `Use this MediCore code to ${action}: ${otp}. It expires in 10 minutes. Never share this code. If you did not request it, ignore this email.`,
      html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:28px;background:#f3f5fa;font-family:Arial,sans-serif;color:#172033">
  <main style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e7eaf2;border-radius:16px;padding:32px">
    <p style="margin:0;color:#2563eb;font-weight:700;font-size:14px;letter-spacing:2px">MEDICORE</p>
    <h1 style="font-size:24px;margin:20px 0 8px">${isVerification ? 'Verify your email' : 'Your security code'}</h1>
    <p style="color:#475569;line-height:1.6">Use this one-time code to ${action}.</p>
    <div style="margin:24px 0;padding:20px;background:#eff6ff;border-radius:12px;text-align:center;color:#1d4ed8;font-size:32px;font-weight:700;letter-spacing:8px">${otp}</div>
    <p style="color:#475569;line-height:1.6">This code expires in <strong>10 minutes</strong>.</p>
    <p style="font-size:12px;color:#64748b;line-height:1.6">Never share this code with anyone. If you did not request it, you can ignore this email.</p>
  </main>
</body>
</html>`,
    });

    const accepted = Array.isArray(info.accepted) ? info.accepted : [];
    const rejected = Array.isArray(info.rejected) ? info.rejected : [];

    console.log('[EMAIL] SMTP sendMail result:', {
      messageId: info.messageId,
      acceptedCount: accepted.length,
      rejectedCount: rejected.length,
      response: info.response,
    });

    if (!accepted.length || rejected.length) {
      const error = new Error('Gmail did not accept the recipient address.');
      error.code = 'EMAIL_RECIPIENT_REJECTED';
      throw error;
    }

    return info;
  } catch (error) {
    console.error('[EMAIL] Delivery submission failed:', {
      code: error.code || 'UNKNOWN',
      message: error.message,
      responseCode: error.responseCode,
      response: error.response,
    });
    throw error;
  } finally {
    transporter.close();
  }
}

module.exports = { sendOtpEmail };