import { parseGrounding, getLegalAssistantResponse, analyzeLegalText, LexCoraChatSession } from '../genaiService';

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContentStream: jest.fn(async () => ({
        response: Promise.resolve({
          text: 'mock reply',
          candidates: [{ groundingMetadata: { groundingChunks: [{ web: { title: 'T', uri: 'http://u' } }] } }]
        }),
        [Symbol.asyncIterator]: async function* () {
          yield { text: 'mock reply' };
        }
      }))
    },
    chats: {
      create: jest.fn().mockImplementation(() => ({
        sendMessage: jest.fn(async () => ({ text: 'chat reply', candidates: [] }))
      }))
    }
  })),
  Chat: jest.fn()
}));

describe('genaiService utilities', () => {
  test('parseGrounding handles normal response', () => {
    const resp = { candidates: [{ groundingMetadata: { groundingChunks: [{ web: { title: 'X', uri: 'u' } }, { web: { title: 'Y', uri: 'v' } }] } }] };
    const sources = parseGrounding(resp as any);
    expect(sources.length).toBe(2);
    expect(sources[0]).toEqual({ title: 'X', uri: 'u' });
  });

  test('getLegalAssistantResponse returns config error without API key', async () => {
    delete process.env.GEMINI_API_KEY;
    const r = await getLegalAssistantResponse('q', 'en');
    expect(r.text).toContain('Service configuration missing');
  });

  test('analyzeLegalText returns config message without API key', async () => {
    delete process.env.GEMINI_API_KEY;
    const r = await analyzeLegalText('txt', 'en');
    expect(r).toContain('API Key not configured');
  });

  test('getLegalAssistantResponse calls AI when key present', async () => {
    process.env.GEMINI_API_KEY = 'key';
    const r = await getLegalAssistantResponse('hello', 'en');
    expect(r.text).toBe('mock reply');
    expect(r.sources.length).toBeGreaterThan(0);
  });

  test('LexCoraChatSession when key absent returns init failed', async () => {
    delete process.env.GEMINI_API_KEY;
    const s = new LexCoraChatSession('en', []);
    const r = await s.sendMessage('x');
    expect(r.text).toContain('Chat initialization failed');
  });

  test('LexCoraChatSession sends message when key present', async () => {
    process.env.GEMINI_API_KEY = 'key';
    const s = new LexCoraChatSession('en', []);
    const r = await s.sendMessage('hello');
    expect(r.text).toBe('mock reply');
  });
});
