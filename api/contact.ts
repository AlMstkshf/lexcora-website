import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, message, subject } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Placeholder for CRM/helpdesk integration
  console.log('Received contact request:', { name, email, phone, subject, message });

  return res.status(200).json({
    success: true,
    message: 'Message received. Our team will be in touch shortly.',
  });
}
