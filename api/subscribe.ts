import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const RESEND_ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Lexcora <updates@mail.lexcora.com>';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!RESEND_API_KEY) {
    return res.status(500).json({ message: 'Missing RESEND_API_KEY configuration.' });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    let contactId: string | undefined;

    if (RESEND_AUDIENCE_ID) {
      const contact = await resend.contacts.create({
        audienceId: RESEND_AUDIENCE_ID,
        email,
      });
      contactId = contact.data?.id;
    }

    if (RESEND_ADMIN_EMAIL) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: RESEND_ADMIN_EMAIL,
        subject: 'New Lexcora newsletter subscriber',
        text: `A new subscriber joined the Lexcora newsletter: ${email}${contactId ? ` (contact id: ${contactId})` : ''}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Welcome to the club!',
    });
  } catch (error: any) {
    console.error('Failed to subscribe email', error);
    const message = error?.message || 'Unable to subscribe right now. Please try again.';
    return res.status(500).json({ success: false, message });
  }
}
