import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getLegalAssistantResponse, analyzeLegalText, LexCoraChatSession } from './genaiService';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/assistant', async (req, res) => {
  const { query, lang = 'en' } = req.body || {};
  if (!query) return res.status(400).json({ error: 'Missing `query` in request body' });

  const result = await getLegalAssistantResponse(query, lang);
  res.json(result);
});

app.post('/api/analyze', async (req, res) => {
  const { text, lang = 'en' } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Missing `text` in request body' });

  const result = await analyzeLegalText(text, lang);
  res.json({ text: result });
});

app.post('/api/chat', async (req, res) => {
  const { message, lang = 'en', history } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Missing `message` in request body' });

  try {
    const session = new LexCoraChatSession(lang, history || []);
    const result = await session.sendMessage(message);
    res.json(result);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat service error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`LEXCORA server listening on port ${port}`));
