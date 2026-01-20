import type { VercelRequest, VercelResponse } from '@vercel/node';

const REDIRECT_URL = 'https://portal.lexcora-mbh.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, firmName, firmSize } = req.body || {};

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Placeholder for DB or CRM write
  console.log('Received trial signup:', { name, email, phone, firmName, firmSize });

  return res.status(200).json({
    success: true,
    message: 'Trial request received',
    redirectUrl: REDIRECT_URL,
  });
}
