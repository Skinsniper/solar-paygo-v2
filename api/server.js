import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { 
  apiVersion: '2024-06-20' 
});

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    );

    if (req.method === 'POST') {
      const { action, deviceId } = req.body;

      if (action === 'register-device') {
        // Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: 2999, // $29.99
          currency: 'usd',
          automatic_payment_methods: { enabled: true },
          metadata: { deviceId }
        });

        // Save to Supabase
        const { data, error } = await supabase
          .from('devices')
          .insert({
            id: deviceId,
            status: 'payment_pending',
            stripe_pi: paymentIntent.id,
            kwh_day: Math.floor(Math.random() * 300 + 100)
          });

        return res.status(200).json({
          success: true,
          clientSecret: paymentIntent.client_secret,
          deviceId: deviceId,
          message: `Payment created! Complete checkout for ${deviceId}`
        });
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}