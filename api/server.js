import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({ 
      success: true, 
      message: '🚀 API LIVE (add Supabase env vars for real DB)' 
    });
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  if (req.method === 'POST') {
    const { action, deviceId } = req.body;
    
    if (action === 'register-device') {
      const { data, error } = await supabase
        .from('devices')
        .insert({ id: deviceId, status: 'active', kwh_day: Math.random() * 300 + 100 });
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      return res.status(200).json({
        success: true,
        device: data[0],
        message: `✅ Panel ${deviceId} registered in Supabase!`
      });
    }
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}