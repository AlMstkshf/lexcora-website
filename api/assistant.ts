import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLegalAssistantResponse, streamChat, parseGrounding, extractChunkText } from '../server/src/genaiService';

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

const sendNdjsonStream = async (res: VercelResponse, streamResult: any, includeSources = false) => {
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

    let sources: any[] = [];
    if (includeSources && streamResult?.response) {
      try {
        const final = await streamResult.response;
        sources = parseGrounding(final);
      } catch {
        sources = [];
      }
    }

    res.write(JSON.stringify({ done: true, sources }) + '\n');
    res.end();
  } catch (err) {
    console.error('Assistant stream error:', err);
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
  const query = typeof body.query === 'string' ? body.query.trim() : '';
  const lang = body.lang === 'ar' ? 'ar' : 'en';

  if (!query) {
    return res.status(400).json({ message: 'Query is required.' });
  }

  try {
    if (wantsStream(req)) {
      const stream = await streamChat(query, lang, []);
      return sendNdjsonStream(res, stream, true);
    }

    const result = await getLegalAssistantResponse(query, lang);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Assistant handler error:', err);
    return res.status(500).json({ message: 'Assistant service error.' });
  }
}
