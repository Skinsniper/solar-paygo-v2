export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  if (req.method === 'POST') {
    const { action, deviceId } = req.body;
    
    if (action === 'register-device') {
      return res.status(200).json({
        success: true,
        device: { id: deviceId, status: 'active', kwh: (Math.random()*300+100).toFixed(1) },
        message: `✅ Panel ${deviceId} registered! ${Math.random()*300+100|0} kWh/day`
      });
    }
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({ status: '🚀 SolarPayGo API LIVE!' });
  }
  
  res.status(405).end();
}