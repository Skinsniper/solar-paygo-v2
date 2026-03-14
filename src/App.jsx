import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

function App() {
  const [deviceId, setDeviceId] = useState('');
  const [status, setStatus] = useState('🌞 SolarPayGo - Register Device');
  const [loading, setLoading] = useState(false);

  const stripePromise = loadStripe('pk_test_51...'); // Your publishable key

  const registerDevice = async () => {
    setLoading(true);
    setStatus('🔄 Creating payment...');
    
    try {
      const response = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'register-device', 
          deviceId: deviceId || 'SOLAR-' + Date.now() 
        })
      });
      
      const data = await response.json();
      
      if (data.clientSecret) {
        const stripe = await stripePromise;
        const { error } = await stripe.confirmCardPayment(data.clientSecret);
        
        if (!error) {
          setStatus('✅ Payment complete! Device activated. Check Supabase dashboard.');
        } else {
          setStatus('❌ Payment failed: ' + error.message);
        }
      } else {
        setStatus(data.message || 'Error: ' + JSON.stringify(data));
      }
    } catch (err) {
      setStatus('Network error: ' + err.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>
          🌞 SolarPayGo AI
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
          Pay-as-you-go solar energy • $29.99/month per panel
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <input
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Enter QR code (SOLAR-XXXX) or auto-generate"
            style={{
              width: '70%',
              padding: '15px',
              fontSize: '18px',
              border: 'none',
              borderRadius: '12px',
              marginRight: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
            disabled={loading}
          />
          <button 
            onClick={registerDevice}
            disabled={loading || !deviceId}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              background: loading ? '#ccc' : '#00ff88',
              color: 'black',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 20px rgba(0,255,136,0.4)'
            }}
          >
            {loading ? '⏳ Processing...' : `💳 Pay $29.99 → Activate`}
          </button>
        </div>
        
        <div style={{ 
          padding: '20px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>{status}</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
            Live: Supabase + Stripe + Vercel ($0/mo)
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;