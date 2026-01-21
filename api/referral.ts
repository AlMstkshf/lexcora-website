import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const resendAdminEmail = process.env.RESEND_ADMIN_EMAIL;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const referralCode =
    typeof req.body?.referralCode === 'string' ? req.body.referralCode.trim() : '';

  if (!email || !referralCode) {
    return res.status(400).json({ error: 'Email and referralCode are required' });
  }

  if (!resend || !resendFromEmail || !resendAdminEmail) {
    return res.status(500).json({ error: 'Missing Resend configuration' });
  }

  try {
    await resend.emails.send({
      from: resendFromEmail,
      to: resendAdminEmail,
      subject: `New referral signup: ${referralCode}`,
      replyTo: email,
      html: `
        <p>A new referral was generated.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Referral Code:</strong> ${referralCode}</p>
        <p>Shareable link: https://lexcora.com/signup?ref=${referralCode}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Referral email error', error);
    return res.status(500).json({ error: 'Failed to send referral notification' });
  }
}
