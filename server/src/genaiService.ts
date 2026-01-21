import { GoogleGenAI } from "@google/genai";

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

export interface InlineDocument {
  data: string;
  mimeType: string;
  name?: string;
}

// Normalize streaming chunks into plain text tokens
export const extractChunkText = (chunk: any): string => {
  if (!chunk) return '';
  // New SDK exposes chunk.text, some builds expose chunk.text() helper
  if (typeof (chunk as any).text === 'string') return (chunk as any).text;
  if (typeof (chunk as any).text === 'function') return (chunk as any).text() || '';
  const candidate = (chunk as any).candidates?.[0];
  const parts = candidate?.content?.parts || [];
  return parts.map((p: any) => p.text || '').join('');
};

const ensureApi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('API Key not configured.');
  return new GoogleGenAI({ apiKey });
};

const buildChatContents = (history: ChatMessage[], nextUserMessage: string) => ([
  ...history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  })),
  { role: 'user', parts: [{ text: nextUserMessage }] }
]);

const buildAnalysisParts = (text: string | undefined, doc?: InlineDocument) => {
  const parts: any[] = [];
  if (text) parts.push({ text: `DOCUMENT FOR ANALYSIS:\n\n${text}` });
  if (doc?.data && doc?.mimeType) {
    parts.push({ inlineData: { data: doc.data, mimeType: doc.mimeType } });
  }
  if (parts.length === 0) {
    parts.push({ text: 'Analyze the attached document.' });
  }
  return parts;
};

const LEXCORA_KNOWLEDGE_BASE = `
IDENTITY: You are 'Rased' (راصد), the Senior Virtual Associate for LEXCORA.
FIRM: LEXCORA is an elite Law Firm ERP for UAE practices.
CAPABILITIES: Case Management, UAE Judicial Deadline tracking, Secure Document Vaults, Bilingual automation.
DOMAIN: Strictly UAE Federal Law (Civil, Labour, Tax, Commercial).
TONE: Authoritative, Concisely Professional, Precise.
`;

const getSystemInstruction = (lang: 'en' | 'ar', task: 'chat' | 'analysis' = 'chat') => {
  const isEn = lang === 'en';
  
  if (task === 'analysis') {
    return isEn 
      ? `You are Rased. Analyze the provided legal text. Provide: 1. Executive Summary, 2. Risk Assessment (UAE Liability), 3. Actionable Recommendations. Use precise terminology.`
      : `أنت 'راصد'. قم بتحليل النص القانوني المقدم. قدم: ١. ملخص تنفيذي، ٢. تقييم المخاطر (المسؤولية القانونية في الإمارات)، ٣. توصيات عملية. استخدم مصطلحات قانونية دقيقة.`;
  }

  return isEn 
    ? `${LEXCORA_KNOWLEDGE_BASE} 
       INSTRUCTIONS: 
       - Cite specific UAE Federal Decree-Laws where possible.
       - Use 'Google Search' to verify recent amendments.
       - If asked non-legal/non-UAE/non-LEXCORA questions, decline politely.
       - Always end with: 'Disclaimer: Informational use only. Not formal legal advice.'`
    : `${LEXCORA_KNOWLEDGE_BASE}
       التعليمات:
       - استشهد بمراسيم القوانين الاتحادية الإماراتية المحددة كلما أمكن ذلك.
       - استخدم 'بحث جوجل' للتحقق من التعديلات الأخيرة.
       - إذا سُئلت أسئلة غير قانونية أو خارج الإمارات، اعتذر بلباقة.
       - انتهِ دائماً بـ: 'إخلاء مسؤولية: للأغراض المعلوماتية فقط، ولا يشكل مشورة قانونية رسمية.'`;
};

export function parseGrounding(response: any): Source[] {
  try {
    const candidates = response?.candidates;
    const metadata = candidates?.[0]?.groundingMetadata;
    const chunks = metadata?.groundingChunks || [];
    
    return chunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ title: web.title, uri: web.uri }));
  } catch (e) {
    return [];
  }
}

export const getLegalAssistantResponse = async (query: string, lang: 'en' | 'ar'): Promise<AssistantResponse> => {
  try {
    const ai = ensureApi();
    const streamResult = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: { 
        systemInstruction: getSystemInstruction(lang),
        tools: [{ googleSearch: {} }],
        temperature: 0.1 
      },
    });

    let text = '';
    let lastChunk: any = null;
    const iterable: AsyncIterable<any> = (streamResult as any).stream || (streamResult as any);

    if (iterable) {
      for await (const chunk of iterable) {
        lastChunk = chunk;
        text += extractChunkText(chunk);
      }
    }

    const finalText = text || extractChunkText(lastChunk) || "No response generated.";
    return { text: finalText, sources: parseGrounding(lastChunk) };
  } catch (error) {
    console.error("Assistant Error:", error);
    return { text: "Error connecting to legal database.", sources: [] };
  }
};

export const analyzeLegalText = async (text: string | undefined, lang: 'en' | 'ar', document?: InlineDocument): Promise<string> => {
  try {
    const ai = ensureApi();
    const streamResult = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: buildAnalysisParts(text, document),
      config: { 
        systemInstruction: getSystemInstruction(lang, 'analysis'),
        temperature: 0.1
      },
    });

    let output = '';
    let lastChunk: any = null;
    const iterable: AsyncIterable<any> = (streamResult as any).stream || (streamResult as any);

    if (iterable) {
      for await (const chunk of iterable) {
        lastChunk = chunk;
        output += extractChunkText(chunk);
      }
    }

    return output || extractChunkText(lastChunk) || "Analysis failed.";
  } catch (error) {
    return "The document analysis service is temporarily unavailable.";
  }
};

export class LexCoraChatSession {
  private lang: 'en' | 'ar';
  private history: ChatMessage[];
  private apiKey: string | null = null;

  constructor(lang: 'en' | 'ar', history: ChatMessage[] = []) {
    this.lang = lang;
    this.history = history;
    this.apiKey = process.env.GEMINI_API_KEY || null;
  }

  async sendMessage(message: string): Promise<AssistantResponse> {
    if (!this.apiKey) return { text: "Chat initialization failed.", sources: [] };
    
    try {
      const ai = ensureApi();
      const streamResult = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: buildChatContents(this.history, message),
        config: { 
          systemInstruction: getSystemInstruction(this.lang),
          tools: [{ googleSearch: {} }],
          temperature: 0.3
        }
      });

      let text = '';
      let lastChunk: any = null;
      const iterable: AsyncIterable<any> = (streamResult as any).stream || (streamResult as any);

      if (iterable) {
        for await (const chunk of iterable) {
          lastChunk = chunk;
          text += extractChunkText(chunk);
        }
      }

      const finalText = text || extractChunkText(lastChunk) || "";
      const sources = parseGrounding(lastChunk);
      this.history.push({ role: 'user', text: message });
      this.history.push({ role: 'model', text: finalText, sources });
      return {
        text: finalText,
        sources
      };
    } catch (error) {
      return { text: "Protocol error in chat session.", sources: [] };
    }
  }
}

export const streamAnalyze = async (text: string | undefined, lang: 'en' | 'ar', document?: InlineDocument) => {
  const ai = ensureApi();
  return ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: buildAnalysisParts(text, document),
    config: { 
      systemInstruction: getSystemInstruction(lang, 'analysis'),
      temperature: 0.1
    },
  });
};

export const streamChat = async (message: string, lang: 'en' | 'ar', history: ChatMessage[] = []) => {
  const ai = ensureApi();
  return ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: buildChatContents(history, message),
    config: { 
      systemInstruction: getSystemInstruction(lang),
      tools: [{ googleSearch: {} }],
      temperature: 0.3
    }
  });
};

export const collectTextFromStream = async (streamResult: any): Promise<string> => {
  let output = '';
  let lastChunk: any = null;
  const iterable: AsyncIterable<any> = (streamResult as any)?.stream || (streamResult as any);
  if (iterable) {
    for await (const chunk of iterable) {
      lastChunk = chunk;
      output += extractChunkText(chunk);
    }
  }
  return output || extractChunkText(lastChunk) || '';
};
