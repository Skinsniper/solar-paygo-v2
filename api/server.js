const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Handle Geo-Detection
  if (req.query && req.query.action === 'get-geo') {
    const country = req.headers['x-vercel-ip-country'] || 'US';
    return res.status(200).json({ country });
  }

  // Handle Stripe Payment
  if (req.method === 'POST') {
    const { action, amount, currency, deviceId } = req.body;
    if (action === 'register-device') {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: currency,
          metadata: { deviceId },
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
      } catch (e) {
        res.status(400).json({ message: e.message });
      }
    }
  }
}
