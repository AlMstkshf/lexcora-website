import React, { useCallback, useMemo, useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    chatbase?: any;
    chatbaseConfig?: {
      chatbotId: string;
      domain?: string;
    };
  }
}

const createChatbaseStub = () => {
  const w = window as any;
  if (w.chatbase) {
    return;
  }

  const queue: any[] = [];
  const stub = (...args: any[]) => {
    queue.push(args);
  };
  (stub as any).q = queue;

  w.chatbase = new Proxy(stub, {
    get(target, prop) {
      if (prop === 'q') {
        return (target as any).q;
      }
      return (...args: any[]) => (target as any)(prop, ...args);
    }
  });
};

export const FakeChatButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enabled = (import.meta.env.VITE_ENABLE_CHATBASE ?? 'true') !== 'false';
  const chatbotId = import.meta.env.NEXT_PUBLIC_CHATBOT_ID;
  const host = useMemo(
    () => (import.meta.env.NEXT_PUBLIC_CHATBASE_HOST || 'https://www.chatbase.co/').replace(/\/+$/, ''),
    [],
  );

  const domain = useMemo(() => {
    try {
      return new URL(host).host || 'www.chatbase.co';
    } catch {
      return host.replace(/^https?:\/\//, '') || 'www.chatbase.co';
    }
  }, [host]);

  const scriptId = useMemo(() => `chatbase-${chatbotId || 'embed'}`, [chatbotId]);

  const injectChatbase = useCallback(async () => {
    if (!chatbotId) {
      setError('Chat is unavailable right now.');
      return;
    }

    setError(null);
    setIsLoading(true);

    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existingScript) {
      setHasActivated(true);
      setIsLoading(false);
      window.chatbase?.('open');
      return;
    }

    createChatbaseStub();
    window.chatbaseConfig = { chatbotId, domain };

    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${host}/embed.min.js`;
        script.id = scriptId;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setHasActivated(true);
          setIsLoading(false);
          window.chatbase?.('open');
          resolve();
        };
        script.onerror = (event) => {
          reject(event);
        };
        document.head.appendChild(script);
      });
    } catch (event) {
      setError('Chat failed to load. Please try again.');
      setIsLoading(false);
      console.error('Chatbase failed to load', event);
    }
  }, [chatbotId, domain, host, scriptId]);

  const handleClick = () => {
    if (!enabled) {
      return;
    }

    if (hasActivated) {
      window.chatbase?.('toggle');
      return;
    }

    void injectChatbase();
  };

  if (!enabled || !chatbotId) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {error && (
        <div className="rounded-md bg-white/95 px-3 py-2 text-sm text-red-700 shadow-lg border border-red-100">
          {error}
        </div>
      )}
      <button
        type="button"
        aria-label="Chat with Lexcora"
        onClick={handleClick}
        className="group relative h-14 w-14 rounded-full bg-gradient-to-br from-[#5c5ef7] via-[#5d48e0] to-[#4b22b5] shadow-2xl transition-all hover:scale-[1.03] hover:shadow-[0_20px_45px_-12px_rgba(75,34,181,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute -left-2 -top-2 h-5 w-5 rounded-full border border-white/40 bg-green-400 shadow-md" />
        <div className="relative flex h-full w-full items-center justify-center text-white">
          {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <MessageCircle className="h-6 w-6" />}
        </div>
      </button>
    </div>
  );
};
