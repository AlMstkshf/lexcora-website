import React, { useEffect } from 'react';

declare global {
  interface Window {
    chatbase?: any;
  }
}

export const ChatbaseEmbed: React.FC = () => {
  useEffect(() => {
    const host = (import.meta.env.NEXT_PUBLIC_CHATBASE_HOST || 'https://www.chatbase.co/').replace(/\/+$/, '');
    const chatbotId = import.meta.env.NEXT_PUBLIC_CHATBOT_ID;

    if (!chatbotId) {
      console.warn('Chatbase chatbot id is missing; skipping embed initialization.');
      return;
    }

    const initializeChatbase = () => {
      const w = window as any;

      if (!w.chatbase || w.chatbase('getState') !== 'initialized') {
        w.chatbase = (...args: any[]) => {
          if (!w.chatbase.q) {
            w.chatbase.q = [];
          }
          w.chatbase.q.push(args);
        };

        w.chatbase = new Proxy(w.chatbase, {
          get(target, prop) {
            if (prop === 'q') {
              return (target as any).q;
            }
            return (...args: any[]) => (target as any)(prop, ...args);
          }
        });
      }

      const onLoad = () => {
        const script = document.createElement('script');
        script.src = `${host}/embed.min.js`;
        script.id = chatbotId;
        (script as any).domain = 'www.chatbase.co';
        document.body.appendChild(script);
      };

      if (document.readyState === 'complete') {
        onLoad();
      } else {
        window.addEventListener('load', onLoad);
        return () => window.removeEventListener('load', onLoad);
      }

      return undefined;
    };

    const cleanup = initializeChatbase();
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  return null;
};
