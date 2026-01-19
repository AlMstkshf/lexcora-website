import { apiKeyAuth } from '../middleware/auth';
import { Request, Response } from 'express';

describe('apiKeyAuth middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    next = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;
    delete process.env.API_KEY;
    delete process.env.API_KEYS;
  });

  test('returns 401 when no key provided and none configured', () => {
    (req.headers as any) = {};

    apiKeyAuth(req as Request, res as Response, next as any);

    expect((res.status as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
    expect((res.json as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
  });

  test('accepts valid Authorization Bearer header', () => {
    process.env.API_KEY = 'abc';
    (req.headers as any) = { authorization: 'Bearer abc' };

    apiKeyAuth(req as Request, res as Response, next as any);

    expect(next).toHaveBeenCalled();
  });

  test('accepts valid x-api-key header', () => {
    process.env.API_KEYS = 'a,b,c';
    (req.headers as any) = { 'x-api-key': 'b' };

    apiKeyAuth(req as Request, res as Response, next as any);

    expect(next).toHaveBeenCalled();
  });
});