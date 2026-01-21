import React, { useEffect, useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { fetchClientSecret, stripePromise } from '../services/stripeClient';

type CheckoutMode = 'payment' | 'subscription' | 'setup';

interface CheckoutEmbedProps {
  mode?: CheckoutMode;
  priceId?: string;
}

// Fetches a Checkout Session client secret and renders the embedded Checkout experience.
export const CheckoutEmbed: React.FC<CheckoutEmbedProps> = ({ mode = 'payment', priceId }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setClientSecret(null);

    const load = async () => {
      try {
        const { clientSecret: secret } = await fetchClientSecret({ mode, priceId });
        if (!cancelled) {
          setClientSecret(secret);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Failed to start checkout.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [mode, priceId]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  if (!clientSecret || !stripePromise || loading) {
    return (
      <div className="p-6 text-center text-slate-500">
        {loading ? 'Preparing secure checkout…' : 'Waiting for Stripe configuration…'}
      </div>
    );
  }

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <div className="min-h-[500px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
        <EmbeddedCheckout />
      </div>
    </EmbeddedCheckoutProvider>
  );
};
