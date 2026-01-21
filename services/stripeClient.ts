import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe.js once per app lifecycle using a publishable key from env.
const publishableKey =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  '';

export const stripePromise: Promise<Stripe | null> = publishableKey
  ? loadStripe(publishableKey)
  : Promise.resolve(null);

type CheckoutMode = 'payment' | 'subscription' | 'setup';

interface FetchClientSecretParams {
  mode?: CheckoutMode;
  priceId?: string;
  baseUrl?: string;
}

// Create a Checkout Session on the server and return its client secret for embedded Checkout.
export async function fetchClientSecret({
  mode = 'payment',
  priceId,
  baseUrl,
}: FetchClientSecretParams = {}): Promise<{ clientSecret: string; sessionId: string; mode: CheckoutMode }> {
  const serverBase =
    baseUrl ||
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.NEXT_PUBLIC_API_BASE_URL ||
    '';

  if (!serverBase) {
    throw new Error('Missing API base URL for checkout session creation.');
  }

  const response = await fetch(`${serverBase}/api/checkout/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, priceId }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to create checkout session: ${message || response.statusText}`);
  }

  const data = await response.json();
  if (!data?.clientSecret || !data?.sessionId) {
    throw new Error('Server did not return a client secret for checkout.');
  }

  return {
    clientSecret: data.clientSecret,
    sessionId: data.sessionId,
    mode: data.mode || mode,
  };
}

// Retrieve a Checkout Session for displaying status on the return page.
export async function fetchCheckoutSession(
  sessionId: string,
  baseUrl?: string
): Promise<{
  id: string;
  status: string | null;
  payment_status: string | null;
  customer_email?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  mode?: CheckoutMode | null;
}> {
  const serverBase =
    baseUrl ||
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.NEXT_PUBLIC_API_BASE_URL ||
    '';

  if (!serverBase) {
    throw new Error('Missing API base URL for checkout session retrieval.');
  }

  const response = await fetch(`${serverBase}/api/checkout/sessions/${sessionId}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to fetch checkout session: ${message || response.statusText}`);
  }

  return response.json();
}
