import type { VercelRequest, VercelResponse } from '@vercel/node';
import { LexCoraChatSession, streamChat, parseGrounding, extractChunkText, ChatMessage } from '../server/src/genaiService';

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
    console.error('Chat stream error:', err);
    res.write(JSON.stringify({ error: 'stream_error' }) + '\n');
    res.end();
  }
};

const sanitizeHistory = (history: any): ChatMessage[] => {
  if (!Array.isArray(history)) return [];
  return history
    .filter(item => item && (item.role === 'user' || item.role === 'model') && typeof item.text === 'string')
    .map(item => ({ role: item.role, text: item.text, sources: item.sources }));
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('API Key is missing');
    }

    const body = parseBody(req) || {};
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const lang = body.lang === 'ar' ? 'ar' : 'en';
    const history = sanitizeHistory(body.history);

    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const streamRequested = wantsStream(req);
    console.log('Incoming chat prompt', {
      lang,
      historyCount: history.length,
      streamRequested,
      messagePreview: message.slice(0, 120),
    });

    if (streamRequested) {
      const stream = await streamChat(message, lang, history);
      console.log('Streaming chat response initiated');
      return sendNdjsonStream(res, stream, true);
    }

    const session = new LexCoraChatSession(lang, history);
    const result = await session.sendMessage(message);
    console.log('Chat response completed', {
      status: 200,
      hasSources: Array.isArray((result as any)?.sources),
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Chat handler error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Chat service error.';
    return res.status(500).json({ error: errorMessage });
  }
}
