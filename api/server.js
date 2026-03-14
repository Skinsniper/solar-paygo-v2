const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {
    const { action, deviceId, currency, amount } = req.body;

    if (action === 'register-device') {
      try {
        // 1. Create the PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // Already in cents from frontend
          currency: currency.toLowerCase(),
          metadata: {
            device_id: deviceId,
            integration_check: 'solar_paygo_v2',
          },
          automatic_payment_methods: { enabled: true },
        });

        // 2. Send the clientSecret back to the frontend
        res.json({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error('Stripe Error:', error.message);
        res.status(500).json({ message: error.message });
      }
    } else {
      res.status(400).json({ message: 'Unknown action' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
