import { GoogleGenAI, Chat } from "@google/genai";

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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { text: "Service configuration missing.", sources: [] };

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: { 
        systemInstruction: getSystemInstruction(lang),
        tools: [{ googleSearch: {} }],
        temperature: 0.1 
      },
    });

    return {
      text: response.text || "No response generated.",
      sources: parseGrounding(response)
    };
  } catch (error) {
    console.error("Assistant Error:", error);
    return { text: "Error connecting to legal database.", sources: [] };
  }
};

export const analyzeLegalText = async (text: string, lang: 'en' | 'ar'): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "API Key not configured.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `DOCUMENT FOR ANALYSIS:\n\n${text}`,
      config: { 
        systemInstruction: getSystemInstruction(lang, 'analysis'),
        temperature: 0.1
      },
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    return "The document analysis service is temporarily unavailable.";
  }
};

export class LexCoraChatSession {
  private chat: Chat | null = null;
  private lang: 'en' | 'ar';

  constructor(lang: 'en' | 'ar', history: ChatMessage[] = []) {
    this.lang = lang;
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      this.chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: { 
          systemInstruction: getSystemInstruction(lang),
          tools: [{ googleSearch: {} }],
          temperature: 0.3
        },
        history: history.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        }))
      });
    }
  }

  async sendMessage(message: string): Promise<AssistantResponse> {
    if (!this.chat) return { text: "Chat initialization failed.", sources: [] };
    
    try {
      const result = await this.chat.sendMessage({ message });
      return {
        text: result.text || "",
        sources: parseGrounding(result)
      };
    } catch (error) {
      return { text: "Protocol error in chat session.", sources: [] };
    }
  }
}
