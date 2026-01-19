import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import RedisStore from 'rate-limit-redis';
import { body, validationResult } from 'express-validator';
import { apiKeyAuth } from './middleware/auth';
import { getLegalAssistantResponse, analyzeLegalText, LexCoraChatSession } from './genaiService';
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
    body('text').isString().trim().isLength({ min: 1, max: 5000 }),
    body('lang').optional().isIn(['en', 'ar'])
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { text, lang = 'en' } = req.body;
    try {
      const result = await analyzeLegalText(text, lang);
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
app.post('/api/assistant',
  [
    body('query').isString().trim().isLength({ min: 1, max: 2000 }),
    body('lang').optional().isIn(['en', 'ar'])
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { query, lang = 'en' } = req.body;
    try {
      const result = await getLegalAssistantResponse(query, lang);
      res.json(result);
    } catch (err) {
      console.error('Assistant error:', err);
      res.status(500).json({ error: 'Assistant service error' });
    }
  }
);

app.post('/api/analyze',
  [
    body('text').isString().trim().isLength({ min: 1, max: 5000 }),
    body('lang').optional().isIn(['en', 'ar'])
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { text, lang = 'en' } = req.body;
    try {
      const result = await analyzeLegalText(text, lang);
      res.json({ text: result });
    } catch (err) {
      console.error('Analyze error:', err);
      res.status(500).json({ error: 'Analysis service error' });
    }
  }
);

app.post('/api/chat',
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
      const session = new LexCoraChatSession(lang, history || []);
      const result = await session.sendMessage(message);
      res.json(result);
    } catch (err) {
      console.error('Chat error:', err);
      res.status(500).json({ error: 'Chat service error' });
    }
  }
);

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`LEXCORA server listening on port ${port}`));
}
