import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import RedisStore from 'rate-limit-redis';
import { body, validationResult } from 'express-validator';
import { apiKeyAuth } from './middleware/auth';
import { getLegalAssistantResponse, analyzeLegalText, LexCoraChatSession, streamAnalyze, streamChat, extractChunkText, parseGrounding } from './genaiService';
import { Request, Response, RequestHandler } from 'express';

dotenv.config();

export const app = express();

// Restrict CORS in production to a configured comma-separated list of origins.
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(s => s.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests like curl, health checks
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());

let redis: Redis | null = null; 

// Rate limiting and API key auth
// Use a lightweight, timer-free store in tests to avoid open handles that hang Jest.
const createTestStore = () => {
  const hits = new Map<string, { count: number; expiresAt: number }>();
  return {
    async incr(key: string, cb: (err: any, hits?: number, resetTime?: number) => void) {
      const now = Date.now();
      const windowMs = Number(process.env.API_RATE_WINDOW_MS || 60000);
      const entry = hits.get(key) || { count: 0, expiresAt: now + windowMs };
      entry.count++;
      hits.set(key, entry);
      cb(null, entry.count, entry.expiresAt - now);
    },
    decrement(key: string) {
      const e = hits.get(key);
      if (e) e.count = Math.max(0, e.count - 1);
    },
    resetKey(key: string) {
      hits.delete(key);
    }
  } as any;
};

const limiterOptions: any = {
  windowMs: Number(process.env.API_RATE_WINDOW_MS || 60000),
  max: Number(process.env.API_RATE_MAX || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
};

let apiLimiter: any;

const wantsStream = (req: Request) => {
  const accept = (req.headers.accept || '').toLowerCase();
  return accept.includes('text/event-stream') || accept.includes('application/x-ndjson') || req.query.stream === '1' || req.headers['x-lexcora-stream'] === '1';
};

const sendNdjsonStream = async (res: Response, streamResult: any, includeSources = false) => {
  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  (res as any).flushHeaders?.();
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
    console.error('Stream piping error:', err);
    res.write(JSON.stringify({ error: 'stream_error' }) + '\n');
    res.end();
  }
};

if (process.env.NODE_ENV === 'test') {
  limiterOptions.store = createTestStore();
  apiLimiter = rateLimit(limiterOptions);
} else if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL);
    const redisStore = new (RedisStore as any)({
      sendCommand: (...args: any[]) => (redis as any).call(...args)
    });
    apiLimiter = rateLimit({ ...limiterOptions, store: redisStore });
    console.log('Using Redis-backed rate limiter');
  } catch (e) {
    console.error('Failed to initialize Redis rate limiter, falling back to memory store', e);
    apiLimiter = rateLimit(limiterOptions);
  }
} else {
  apiLimiter = rateLimit(limiterOptions);
}

// Build API router so tests can assemble their own app + limiter if needed.
export const apiRouter = express.Router();

// Routes (moved to router)
apiRouter.post('/assistant',
  [
    body('query').isString().trim().isLength({ min: 1, max: 2000 }),
    body('lang').optional().isIn(['en', 'ar'])
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { query, lang = 'en' } = req.body;
    try {
      if (wantsStream(req)) {
        const stream = await streamChat(query, lang, []);
        return sendNdjsonStream(res, stream, true);
      }
      const result = await getLegalAssistantResponse(query, lang);
      res.json(result);
    } catch (err) {
      console.error('Assistant error:', err);
      res.status(500).json({ error: 'Assistant service error' });
    }
  }
);

apiRouter.post('/analyze',
  [
    body('text').optional().isString().trim().isLength({ min: 1, max: 5000 }),
    body('document.data').optional().isString(),
    body('document.mimeType').optional().isString(),
    body('document.name').optional().isString(),
    body('lang').optional().isIn(['en', 'ar'])
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { text, lang = 'en', document } = req.body;
    if (!text && !(document?.data && document?.mimeType)) {
      return res.status(400).json({ error: 'Provide text or document for analysis.' });
    }
    const inlineDoc = document?.data && document?.mimeType ? {
      data: document.data,
      mimeType: document.mimeType,
      name: document.name
    } : undefined;

    try {
      if (wantsStream(req)) {
        const stream = await streamAnalyze(text, lang, inlineDoc);
        return sendNdjsonStream(res, stream);
      }
      const result = await analyzeLegalText(text, lang, inlineDoc);
      res.json({ text: result });
    } catch (err) {
      console.error('Analyze error:', err);
      res.status(500).json({ error: 'Analysis service error' });
    }
  }
);

apiRouter.post('/chat',
  [
    body('message').isString().trim().isLength({ min: 1, max: 3000 }),
    body('lang').optional().isIn(['en', 'ar']),
    body('history').optional().isArray(),
    body('history.*.role').optional().isIn(['user', 'model']),
    body('history.*.text').optional().isString().isLength({ min: 1, max: 2000 })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { message, lang = 'en', history } = req.body;
    try {
      if (wantsStream(req)) {
        const stream = await streamChat(message, lang, history || []);
        return sendNdjsonStream(res, stream, true);
      }
      const session = new LexCoraChatSession(lang, history || []);
      const result = await session.sendMessage(message);
      res.json(result);
    } catch (err) {
      console.error('Chat error:', err);
      res.status(500).json({ error: 'Chat service error' });
    }
  }
);

// Apply middleware and router to app. In tests we avoid applying the global rate limiter to prevent open handles.
if (process.env.NODE_ENV === 'test') {
  app.use('/api', apiKeyAuth as RequestHandler, apiRouter);
} else {
  app.use('/api', apiLimiter, apiKeyAuth as RequestHandler, apiRouter);
}

// Health endpoint for readiness/liveness checks
app.get('/health', async (_req, res) => {
  const health: any = { status: 'ok', uptime: process.uptime() };
  try {
    if (redis) {
      const pong = await redis.ping();
      health.redis = pong === 'PONG' ? 'connected' : 'unhealthy';
    } else {
      health.redis = 'not-configured';
    }
  } catch (e) {
    health.redis = 'unavailable';
  }
  res.json(health);
});

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`LEXCORA server listening on port ${port}`));
}
