import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

export const app = express();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2023-10-16' })
  : null;
const priceId = process.env.STRIPE_PRICE_ID;

// Restrict CORS in production to a configured comma-separated list of origins.
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());

// Health endpoint for readiness/liveness checks
app.get('/health', (_req, res) => {
  const health: any = { status: 'ok', uptime: process.uptime() };
  res.json(health);
});

// Create an embedded Checkout Session and return the client secret
app.post('/api/checkout/sessions', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured.' });
  }

  const { mode: requestedMode, priceId: bodyPriceId } = req.body || {};
  const mode = (requestedMode || 'payment') as 'payment' | 'subscription' | 'setup';
  const activePriceId = bodyPriceId || priceId;
  const returnUrlBase = process.env.CHECKOUT_RETURN_URL || 'http://localhost:3000';

  if (mode !== 'setup' && !activePriceId) {
    return res.status(400).json({ error: 'Missing price ID for checkout session.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode,
      return_url: `${returnUrlBase}?session_id={CHECKOUT_SESSION_ID}`,
      ...(mode === 'setup'
        ? {}
        : {
            line_items: [
              {
                price: activePriceId,
                quantity: 1,
              },
            ],
          }),
    });

    if (!session.client_secret) {
      throw new Error('Stripe did not return a client secret for the Checkout Session.');
    }

    res.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
      mode,
    });
  } catch (err: any) {
    console.error('Failed to create Checkout Session', err);
    res.status(500).json({ error: err.message || 'Unable to create checkout session' });
  }
});

// Retrieve a Checkout Session to power the return page/status checks
app.get('/api/checkout/sessions/:id', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured.' });
  }

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Checkout Session ID is required.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    res.json({
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency,
      mode: session.mode,
    });
  } catch (err: any) {
    console.error('Failed to retrieve Checkout Session', err);
    res.status(500).json({ error: err.message || 'Unable to retrieve checkout session' });
  }
});

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`LEXCORA server listening on port ${port}`));
}
