import { Request, Response, NextFunction } from 'express';

// Simple API-key based auth. Supports a single API_KEY or multiple comma-separated API_KEYS.
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] as string | undefined;
  const headerKey = req.headers['x-api-key'] as string | undefined;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : headerKey;

  const envKeys = (process.env.API_KEYS || process.env.API_KEY || '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);

  if (!token || envKeys.length === 0 || !envKeys.includes(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};
