import type { VercelRequest, VercelResponse } from '@vercel/node';
import { analyzeLegalText, streamAnalyze, extractChunkText } from '../server/src/genaiService';

const parseBody = (req: VercelRequest) => {
  const raw = req.body;
  if (!raw) return {};
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString('utf8'));
    } catch {
      return {};
    }
  }
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw;
};

const wantsStream = (req: VercelRequest) => {
  const accept = (req.headers.accept || '').toLowerCase();
  const streamParam = (req.query?.stream || '').toString();
  return accept.includes('text/event-stream')
    || accept.includes('application/x-ndjson')
    || streamParam === '1'
    || req.headers['x-lexcora-stream'] === '1';
};

const sendNdjsonStream = async (res: VercelResponse, streamResult: any) => {
  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const iterable: AsyncIterable<any> = (streamResult?.stream || streamResult) as any;
  try {
    if (iterable) {
      for await (const chunk of iterable) {
        const text = extractChunkText(chunk);
        if (text) res.write(JSON.stringify({ text }) + '\n');
      }
    }
    res.write(JSON.stringify({ done: true }) + '\n');
    res.end();
  } catch (err) {
    console.error('Analyze stream error:', err);
    res.write(JSON.stringify({ error: 'stream_error' }) + '\n');
    res.end();
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const body = parseBody(req);
  const text = typeof body.text === 'string' ? body.text.trim() : undefined;
  const lang = body.lang === 'ar' ? 'ar' : 'en';
  const document = body.document;

  const hasDocument = document && typeof document.data === 'string' && typeof document.mimeType === 'string';

  if (!text && !hasDocument) {
    return res.status(400).json({ message: 'Provide text or document for analysis.' });
  }

  const inlineDoc = hasDocument ? {
    data: document.data,
    mimeType: document.mimeType,
    name: typeof document.name === 'string' ? document.name : undefined
  } : undefined;

  try {
    if (wantsStream(req)) {
      const stream = await streamAnalyze(text, lang, inlineDoc);
      return sendNdjsonStream(res, stream);
    }

    const result = await analyzeLegalText(text, lang, inlineDoc);
    return res.status(200).json({ text: result });
  } catch (err) {
    console.error('Analyze handler error:', err);
    return res.status(500).json({ message: 'Analysis service error.' });
  }
}
