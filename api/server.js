import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

export default async function handler(req, res) {
  // ... CORS headers same as before

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  if (req.method === 'POST') {
    const { action, deviceId, paymentIntentId } = req.body;

    if (action === 'register-device') {
      // Create Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 2999, // $29.99
        currency: 'usd',
        metadata: { deviceId }
      });

      const { data, error } = await supabase
        .from('devices')
        .insert({ 
          id: deviceId, 
          status: 'payment_pending',
          stripe_pi: paymentIntent.id,
          kwh_day: Math.random() * 300 + 100 
        });

      return res.status(200).json({
        success: true,
        device: data[0],
        clientSecret: paymentIntent.client_secret,
        message: `Payment started for ${deviceId}! Complete in Stripe modal.`
      });
    }

    if (action === 'confirm-payment') {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        await supabase
          .from('devices')
          .update({ status: 'active' })
          .eq('stripe_pi', paymentIntentId);
        
        return res.json({ success: true, message: 'Payment confirmed! Panel activated.' });
      }
    }
  }
}