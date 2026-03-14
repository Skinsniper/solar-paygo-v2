import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // 1. Handle GET requests for Geo-Detection
  if (req.method === 'GET' && req.query.action === 'get-geo') {
    const country = req.headers['x-vercel-ip-country'] || 'US';
    return res.status(200).json({ country });
  }

  // 2. Handle POST requests for Stripe
  if (req.method === 'POST') {
    const { action, amount, currency, deviceId } = req.body;

    if (action === 'register-device') {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // already in cents from frontend
          currency: currency || 'usd',
          metadata: { deviceId },
          automatic_payment_methods: { enabled: true },
        });

        return res
          .status(200)
          .json({ clientSecret: paymentIntent.client_secret });
      } catch (e) {
        return res.status(400).json({ message: e.message });
      }
    }
  }

  // 3. Fallback for unhandled methods
  return res.status(405).json({ message: 'Method not allowed' });
}
