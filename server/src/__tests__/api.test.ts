// Set env variables before importing app so rate limiter picks them up
process.env.API_KEY = 'testkey';
process.env.API_RATE_WINDOW_MS = '1000';
// Use a high rate limit for normal tests; create a dedicated app instance for rate-limit test below.
process.env.API_RATE_MAX = '1000';

import request from 'supertest';
import { app } from '../index';

// Mock the genaiService module
jest.mock('../genaiService', () => ({
  getLegalAssistantResponse: jest.fn(async (q: string) => ({ text: `echo:${q}`, sources: [] })),
  analyzeLegalText: jest.fn(async (t: string) => `analysis:${t}`),
  LexCoraChatSession: jest.fn().mockImplementation(() => ({
    sendMessage: jest.fn(async (m: string) => ({ text: `chat:${m}`, sources: [] }))
  }))
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
    // Create a fresh app instance with a low rate limit
    jest.resetModules();
    process.env.API_RATE_MAX = '1';
    const { app: limitedApp } = require('../index');

    // First request to limited app should be ok
    const ok = await request(limitedApp)
      .post('/api/assistant')
      .set('Authorization', 'Bearer testkey')
      .send({ query: 'one' });
    expect(ok.status).toBe(200);

    // Second request immediately should be rate-limited
    const over = await request(limitedApp)
      .post('/api/assistant')
      .set('Authorization', 'Bearer testkey')
      .send({ query: 'two' });

    expect([429, 503]).toContain(over.status);

    // Restore initial app (imported at top) for remaining tests
    jest.resetModules();
    process.env.API_RATE_MAX = '1000';
  });

  test('chat validation rejects bad history', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('Authorization', 'Bearer testkey')
      .send({ message: 'hi', history: [{ role: 'hacker', text: 'x' }] });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});
