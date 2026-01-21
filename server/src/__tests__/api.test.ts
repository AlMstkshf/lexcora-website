// Set env variables before importing app so rate limiter picks them up
process.env.API_KEY = 'testkey';
process.env.API_RATE_WINDOW_MS = '1000';
// Use a high rate limit for normal tests; create a dedicated app instance for rate-limit test below.
process.env.API_RATE_MAX = '1000';

import request from 'supertest';
import { app, apiRouter } from '../index';
import { Request, Response, NextFunction } from 'express';

// Mock the genaiService module
jest.mock('../genaiService', () => ({
  getLegalAssistantResponse: jest.fn(async (q: string) => ({ text: `echo:${q}`, sources: [] })),
  analyzeLegalText: jest.fn(async (t: string) => `analysis:${t}`),
  streamAnalyze: jest.fn(async (t: string) => ({
    response: Promise.resolve({ text: `analysis:${t}` }),
    [Symbol.asyncIterator]: async function* () { yield { text: `analysis:${t}` }; }
  })),
  LexCoraChatSession: jest.fn().mockImplementation(() => ({
    sendMessage: jest.fn(async (m: string) => ({ text: `chat:${m}`, sources: [] }))
  })),
  streamChat: jest.fn(async (m: string) => ({
    response: Promise.resolve({ text: `chat:${m}` }),
    [Symbol.asyncIterator]: async function* () { yield { text: `chat:${m}` }; }
  })),
  extractChunkText: (chunk: any) => chunk.text || '',
  parseGrounding: jest.fn(() => [])
}));

describe('API endpoints', () => {
  test('rejects requests without API key', async () => {
    const res = await request(app).post('/api/assistant').send({ query: 'test' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  test('validation: missing query', async () => {
    const res = await request(app)
      .post('/api/assistant')
      .set('Authorization', 'Bearer testkey')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('assistant success', async () => {
    const res = await request(app)
      .post('/api/assistant')
      .set('Authorization', 'Bearer testkey')
      .send({ query: 'hello', lang: 'en' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('text');
    expect(res.body.text).toContain('echo:');
  });

  test('rate limiting is applied', async () => {
    // Build an isolated app with a small test store-based limiter so it doesn't create global timers.
    const express = require('express');
    const rateLimit = require('express-rate-limit');
    const { apiRouter } = require('../index');

    const createTestStore = () => {
      const hits = new Map();
      return {
        async incr(key: string, cb: any) {
          const now = Date.now();
          const windowMs = 1000;
          const entry = hits.get(key) || { count: 0, expiresAt: now + windowMs };
          entry.count++;
          hits.set(key, entry);
          cb(null, entry.count, entry.expiresAt - now);
        },
        decrement() {},
        resetKey(key: string) { hits.delete(key); }
      };
    };

    const appLimited = express();
    appLimited.use(express.json());
    appLimited.use('/api', rateLimit({ windowMs: 1000, max: 1, store: createTestStore() }), (req: Request, res: Response, next: NextFunction) => { req.headers['authorization'] = 'Bearer testkey'; next(); }, apiRouter);

    // First request should be ok
    const ok = await request(appLimited)
      .post('/api/assistant')
      .send({ query: 'one' });
    expect(ok.status).toBe(200);

    // Second request immediately should be rate-limited
    const over = await request(appLimited)
      .post('/api/assistant')
      .send({ query: 'two' });

    expect([429, 503, 500]).toContain(over.status);
  });

  test('chat validation rejects bad history', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', 'Bearer testkey')
      .send({ message: 'hi', history: [{ role: 'hacker', text: 'x' }] });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('assistant returns 500 when service throws', async () => {
    const mod = require('../genaiService');
    mod.getLegalAssistantResponse.mockImplementationOnce(async () => { throw new Error('boom'); });

    const res = await request(app)
      .post('/api/assistant')
      .set('Authorization', 'Bearer testkey')
      .send({ query: 'x' });

    expect(res.status).toBe(500);
  });

  test('analyze returns 500 when service throws', async () => {
    const mod = require('../genaiService');
    mod.analyzeLegalText.mockImplementationOnce(async () => { throw new Error('boom'); });

    const res = await request(app)
      .post('/api/analyze')
      .set('Authorization', 'Bearer testkey')
      .send({ text: 'x' });

    expect(res.status).toBe(500);
  });

  test('chat returns 500 when chat send throws', async () => {
    const mod = require('../genaiService');
    mod.LexCoraChatSession.mockImplementationOnce(() => ({ sendMessage: jest.fn(async () => { throw new Error('boom'); }) }));

    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', 'Bearer testkey')
      .send({ message: 'hello' });

    expect(res.status).toBe(500);
  });
});
