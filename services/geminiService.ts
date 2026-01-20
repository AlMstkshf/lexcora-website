/* Client-side proxy to server-side GenAI endpoints — avoids bundling credentials in the frontend */

export interface Source {
  title: string;
  uri: string;
}

export interface AssistantResponse {
  text: string;
  sources: Source[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: Source[];
}

/* Server-only instructions and grounding parsing run on the server. Client uses proxied API calls to `/api/*`. */

const buildAuthHeaders = () => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  // Optional client-side API key for dev/local environments; avoid setting this in production bundles
  const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  return headers;
};

export const getLegalAssistantResponse = async (query: string, lang: 'en' | 'ar'): Promise<AssistantResponse> => {
  try {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: buildAuthHeaders(),
      body: JSON.stringify({ query, lang }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('Assistant API error:', res.status, txt);
      return { text: 'Assistant service unavailable.', sources: [] };
    }

    return await res.json();
  } catch (err) {
    console.error('Assistant API call failed:', err);
    return { text: 'Assistant service unavailable.', sources: [] };
  }
};

export const analyzeLegalText = async (text: string, lang: 'en' | 'ar'): Promise<string> => {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: buildAuthHeaders(),
      body: JSON.stringify({ text, lang }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('Analyze API error:', res.status, txt);
      return 'The document analysis service is temporarily unavailable.';
    }

    const data = await res.json();
    return data.text || 'The document analysis service is temporarily unavailable.';
  } catch (err) {
    console.error('Analyze API call failed:', err);
    return 'The document analysis service is temporarily unavailable.';
  }
};

export class LexCoraChatSession {
  private lang: 'en' | 'ar';
  private history: ChatMessage[] = [];

  constructor(lang: 'en' | 'ar', history: ChatMessage[] = []) {
    this.lang = lang;
    this.history = history;
  }

  async sendMessage(message: string): Promise<AssistantResponse> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: buildAuthHeaders(),
        body: JSON.stringify({ message, lang: this.lang, history: this.history }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('Chat API error:', res.status, txt);
        return { text: 'Chat service error.', sources: [] };
      }

      const data = await res.json();
      // append to local history
      this.history.push({ role: 'user', text: message });
      if (data && data.text) this.history.push({ role: 'model', text: data.text });
      return data as AssistantResponse;
    } catch (err) {
      console.error('Chat API call failed:', err);
      return { text: 'Chat service error.', sources: [] };
    }
  }
}
