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

export interface UploadedDocument {
  base64?: string;
  mimeType?: string;
  name?: string;
}

type StreamChunk = {
  text?: string;
  done?: boolean;
  sources?: Source[];
  error?: string;
};

/* Server-only instructions and grounding parsing run on the server. Client uses proxied API calls to `/api/*`. */

const buildAuthHeaders = () => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  // Optional client-side API key for dev/local environments; avoid setting this in production bundles
  const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  return headers;
};

const readNdjsonStream = async (res: Response, onMessage: (chunk: StreamChunk) => void) => {
  const reader = res.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        onMessage(JSON.parse(trimmed));
      } catch (e) {
        console.error('Stream parse error', e, trimmed);
      }
    }
  }
  if (buffer.trim()) {
    try {
      onMessage(JSON.parse(buffer.trim()));
    } catch (e) {
      console.error('Stream parse error (tail)', e, buffer);
    }
  }
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

interface AnalyzeOptions {
  document?: UploadedDocument;
  onToken?: (partial: string) => void;
}

export const analyzeLegalText = async (text: string | undefined, lang: 'en' | 'ar', options?: AnalyzeOptions): Promise<string> => {
  try {
    const wantsStream = typeof options?.onToken === 'function';
    const payload: any = { lang };
    if (text) payload.text = text;
    if (options?.document?.base64) {
      payload.document = {
        data: options.document.base64,
        mimeType: options.document.mimeType || 'application/pdf',
        name: options.document.name
      };
    }

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { ...buildAuthHeaders(), ...(wantsStream ? { Accept: 'application/x-ndjson' } : {}) },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('Analyze API error:', res.status, txt);
      return 'The document analysis service is temporarily unavailable.';
    }

    if (!wantsStream) {
      const data = await res.json();
      return data.text || 'The document analysis service is temporarily unavailable.';
    }

    let aggregated = '';
    await readNdjsonStream(res, (chunk) => {
      if (chunk.error) throw new Error(chunk.error);
      if (chunk.text) {
        aggregated += chunk.text;
        options?.onToken?.(aggregated);
      }
    });
    return aggregated || 'The document analysis service is temporarily unavailable.';
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

  async sendMessage(message: string, onToken?: (partial: string, sources?: Source[]) => void): Promise<AssistantResponse> {
    try {
      const wantsStream = typeof onToken === 'function';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { ...buildAuthHeaders(), ...(wantsStream ? { Accept: 'application/x-ndjson' } : {}) },
        body: JSON.stringify({ message, lang: this.lang, history: this.history }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('Chat API error:', res.status, txt);
        return { text: 'Chat service error.', sources: [] };
      }

      if (!wantsStream) {
        const data = await res.json();
        this.history.push({ role: 'user', text: message });
        if (data && data.text) this.history.push({ role: 'model', text: data.text, sources: data.sources });
        return data as AssistantResponse;
      }

      let aggregated = '';
      let finalSources: Source[] = [];
      await readNdjsonStream(res, (chunk) => {
        if (chunk.error) throw new Error(chunk.error);
        if (chunk.text) {
          aggregated += chunk.text;
          onToken?.(aggregated, finalSources);
        }
        if (chunk.sources) {
          finalSources = chunk.sources;
          onToken?.(aggregated, finalSources);
        }
      });

      const result: AssistantResponse = { text: aggregated, sources: finalSources };
      this.history.push({ role: 'user', text: message });
      this.history.push({ role: 'model', text: aggregated, sources: finalSources });
      return result;
    } catch (err) {
      console.error('Chat API call failed:', err);
      return { text: 'Chat service error.', sources: [] };
    }
  }
}
