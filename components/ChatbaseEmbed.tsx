import React, { useEffect } from 'react';

declare global {
  interface Window {
    chatbase?: any;
  }
}

export const ChatbaseEmbed: React.FC = () => {
  useEffect(() => {
    const enabled = (import.meta.env.VITE_ENABLE_CHATBASE ?? 'true') !== 'false';
    if (!enabled) {
      return;
    }

    const ensureAccessibleBubble = () => {
      const bubble = document.getElementById('chatbase-bubble-button');
      if (!bubble) return;

      // Bubble sometimes ships with aria-hidden while still being focusable; remove the conflict.
      if (bubble.getAttribute('aria-hidden') === 'true') {
        bubble.removeAttribute('aria-hidden');
      }
      if (bubble.getAttribute('tabindex') === '-1') {
        bubble.removeAttribute('tabindex');
      }
      if (!bubble.getAttribute('aria-label')) {
        bubble.setAttribute('aria-label', 'Open chat');
      }

      bubble.querySelectorAll('[aria-hidden="true"]').forEach((node) => {
        (node as HTMLElement).removeAttribute('aria-hidden');
      });
    };

    let observer: MutationObserver | null = null;
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
        ensureAccessibleBubble();
      };

      if (document.readyState === 'complete') {
        onLoad();
      } else {
        window.addEventListener('load', onLoad);
        return () => window.removeEventListener('load', onLoad);
      }

      observer = new MutationObserver(() => ensureAccessibleBubble());
      observer.observe(document.body, { childList: true, subtree: true, attributes: true });
      ensureAccessibleBubble();

      return undefined;
    };

    const cleanup = initializeChatbase();
    return () => {
      if (cleanup) {
        cleanup();
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return null;
};
