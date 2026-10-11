const nodemailer = require('nodemailer');

const maskEmail = (value = '') => {
  const [name, domain] = String(value).split('@');
  if (!name || !domain) return '[invalid email]';
  return `${name.slice(0, 1)}***@${domain}`;
};

async function sendOtpEmail({ to, otp, purpose = 'verification' }) {
  const MAILJET_API_KEY = process.env.MAILJET_API_KEY?.trim();
  const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY?.trim();
  const EMAIL_FROM = process.env.EMAIL_FROM?.trim();
  const EMAIL_USER = process.env.EMAIL_USER?.trim();
  const EMAIL_PASS = process.env.EMAIL_PASS?.replace(/\s+/g, '');

  console.log(`[EMAIL] Request received for ${maskEmail(to)} (${purpose}).`);

  const isVerification = purpose === 'verification';
  const subject = isVerification
    ? 'Verify your MediCore email'
    : 'Your MediCore security code';
  const action = isVerification
    ? 'verify your email address'
    : 'complete your request';
  const text = `Use this MediCore code to ${action}: ${otp}. It expires in 10 minutes. Never share this code. If you did not request it, ignore this email.`;
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
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
</html>`;

  if (MAILJET_API_KEY || MAILJET_SECRET_KEY) {
    if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY || !EMAIL_FROM) {
      const error = new Error('Email is not configured. Set MAILJET_API_KEY, MAILJET_SECRET_KEY, and EMAIL_FROM.');
      error.code = 'EMAIL_NOT_CONFIGURED';
      throw error;
    }

    const authorization = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`).toString('base64');
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authorization}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Messages: [{
          From: { Email: EMAIL_FROM, Name: 'MediCore' },
          To: [{ Email: to }],
          Subject: subject,
          TextPart: text,
          HTMLPart: html,
        }],
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.Messages?.[0]?.Status !== 'success') {
      const error = new Error(`Mailjet email request failed with status ${response.status}.`);
      error.code = 'EMAIL_API_ERROR';
      console.error('[EMAIL] Mailjet delivery failed:', { status: response.status });
      throw error;
    }

    const message = result.Messages[0].To?.[0];
    console.log('[EMAIL] Mailjet accepted message:', {
      messageId: message?.MessageID,
      to: maskEmail(to),
      purpose,
    });
    return result;
  }

  if (!EMAIL_USER || !EMAIL_PASS) {
    const error = new Error(
      'Email is not configured. Set Mailjet credentials, or EMAIL_USER and EMAIL_PASS for local Gmail SMTP.'
    );
    error.code = 'EMAIL_NOT_CONFIGURED';
    console.error('[EMAIL] Configuration missing.');
    throw error;
  }

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
      text,
      html,
    });

    if (!info.accepted?.length || info.rejected?.length) {
      const error = new Error('Gmail did not accept the recipient address.');
      error.code = 'EMAIL_RECIPIENT_REJECTED';
      throw error;
    }

    console.log('[EMAIL] SMTP accepted message:', { messageId: info.messageId, to: maskEmail(to), purpose });
    return info;
  } catch (error) {
    console.error('[EMAIL] SMTP delivery submission failed:', {
      code: error.code || 'UNKNOWN',
      message: error.message,
      responseCode: error.responseCode,
    });
    throw error;
  } finally {
    transporter.close();
  }
}

module.exports = { sendOtpEmail };
