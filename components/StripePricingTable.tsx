'use client';

import { useEffect, useState } from 'react';

const STRIPE_PRICING_SCRIPT = 'https://js.stripe.com/v3/pricing-table.js';

export default function StripePricingTable() {
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const existing = document.querySelector(
      'script[data-stripe-pricing]',
    ) as HTMLScriptElement | null;

    const markReady = () => setScriptReady(true);

    if (existing) {
      if (existing.getAttribute('data-loaded') === 'true') {
        setScriptReady(true);
      } else {
        existing.addEventListener('load', markReady);
      }
      return () => existing.removeEventListener('load', markReady);
    }

    const script = document.createElement('script');
    script.src = STRIPE_PRICING_SCRIPT;
    script.async = true;
    script.dataset.stripePricing = 'true';
    script.onload = () => {
      script.setAttribute('data-loaded', 'true');
      setScriptReady(true);
    };
    script.onerror = () =>
      console.error('Failed to load Stripe pricing table script');

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', markReady);
    };
  }, []);

  if (!scriptReady) return null;

  return (
    // @ts-expect-error Custom element provided by Stripe
    <stripe-pricing-table
      pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
      publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
    />
  );
}
