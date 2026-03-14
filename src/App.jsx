// Use your actual Stripe Public Key
const stripePromise = loadStripe(
  'pk_test_51SwS6rRYjVQJNcqWtPc3OFy42i73ZvOKINA7vAnb9G5jcEGCB0QlNgjLpeibFNeLXOXfX08WRXiolLxcAyYChxOM00QuTl7lix',
);

function App() {
  const [deviceId, setDeviceId] = useState('');
  const [status, setStatus] = useState('🌞 SolarPayGo - Register Device');
  const [loading, setLoading] = useState(false);
  import { useState, useEffect, useRef } from 'react';
  import { loadStripe } from '@stripe/stripe-js';

  // Using your provided Stripe Public Key
  const stripePromise = loadStripe('pk_test_51SwS6rRYjVQJNcqWtPc3OFy42i73ZvOKINA7vAnb9G5jcEGCB0QlNgjLpeibFNeLXOXfX08WRXiolLxcAyYChxOM00QuTl7lix');

  export default function App() {
    const [deviceId, setDeviceId] = useState('');
    const [status, setStatus] = useState('🌞 SolarPayGo - Ready');
    const [loading, setLoading] = useState(false);
    const [currency, setCurrency] = useState('USD');
    const [price, setPrice] = useState(29.99);
    const [symbol, setSymbol] = useState('$');
  
    const canvasRef = useRef();

    // Currency Map for Local Pricing
    const currencyMap = {
      'US': { code: 'usd', symbol: '$', price: 29.99 },
      'GB': { code: 'gbp', symbol: '£', price: 24.99 },
      'IN': { code: 'inr', symbol: '₹', price: 2499 },
      'BR': { code: 'brl', symbol: 'R$', price: 159.99 },
      'EU': { code: 'eur', symbol: '€', price: 27.99 }
    };

    // Detect Location via Backend (Vercel Headers)
    useEffect(() => {
      fetch('/api/server?action=get-geo')
        .then(res => res.json())
        .then(data => {
          const geo = data.country || 'US';
          const config = currencyMap[geo] || currencyMap['US'];
          setCurrency(config.code);
          setPrice(config.price);
          setSymbol(config.symbol);
        })
        .catch(() => console.log("Defaulting to USD"));
    }, []);

    // 3D Solar Panel Animation
    useEffect(() => {
      if (!window.THREE || !canvasRef.current) return;
      const THREE = window.THREE;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
      renderer.setSize(400, 300);
    
      const geometry = new THREE.BoxGeometry(2, 0.1, 1);
      const material = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
      const panel = new THREE.Mesh(geometry, material);
      scene.add(panel);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 5, 5);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0x404040));
      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);
        panel.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
      return () => renderer.dispose();
    }, []);

    const handlePayment = async () => {
      if (!deviceId) return alert("Please enter a Device ID");
      setLoading(true);
      setStatus('🔄 Initializing Stripe...');

      try {
        const response = await fetch('/api/server', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'register-device', 
            deviceId, 
            currency, 
            amount: Math.round(price * 100) 
          })
        });

        const { clientSecret } = await response.json();
        const stripe = await stripePromise;
        const { error } = await stripe.confirmCardPayment(clientSecret);

        if (error) {
          setStatus('❌ Error: ' + error.message);
        } else {
          setStatus('✅ Activated! Powering up...');
        }
      } catch (err) {
        setStatus('❌ Network Error');
      }
      setLoading(false);
    };

    return (
      <div style={{ minHeight: '100vh', background: '#0f2027', color: 'white', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
        <header>
          <h1 style={{ fontSize: '3rem', color: '#ffd700', margin: '10px 0' }}>🌞 SolarPayGo AI</h1>
          <p style={{ opacity: 0.8, marginBottom: '30px' }}>Global Pay-as-you-go Energy</p>
        </header>

        <div style={{ margin: '20px auto' }}>
          <canvas ref={canvasRef} style={{ borderRadius: '20px', maxWidth: '100%', height: '300px' }} />
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '30px', 
          borderRadius: '20px', 
          maxWidth: '450px', 
          margin: '0 auto',
          backdropFilter: 'blur(10px)'
        }}>
          <h2>{status}</h2>
          <p>Local Price: {symbol}{price}</p>
          
          <input
            type="text"
            placeholder="Enter Device ID (SOLAR-XXXX)"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: 'none', boxSizing: 'border-box' }}
          />

          <button
            onClick={handlePayment}
            disabled={loading || !deviceId}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? '#666' : '#ffd700',
              color: 'black',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : `Activate for ${symbol}${price}`}
          </button>
        </div>
      </div>
    );
} // This closes the App function - Make sure this exists!

export default App; // This must be the very last line
            onChange={e => setDeviceId(e.target.value)}
            style={{ width: '80%', padding: '10px', borderRadius: '5px', border: 'none' }}
          />
          <button 
            onClick={handlePayment} 
            disabled={loading}
            style={{ display: 'block', width: '84%', margin: '15px auto', padding: '12px', background: '#ffd700', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Processing...' : 'Activate Now'}
          </button>
        </div>
      </div>
    );
  }
        <p style={{ opacity: 0.8, marginBottom: '30px' }}>
          Global Pay-as-you-go Energy • AI Fraud Protection
        </p>
      </header>

      <div style={{ margin: '20px auto' }}>
        <canvas
          ref={canvasRef}
          style={{ borderRadius: '20px', maxWidth: '100%', height: '300px' }}
        />
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '30px',
          borderRadius: '20px',
          maxWidth: '450px',
          margin: '0 auto',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>{status}</h2>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          Detected Currency: <strong>{currency}</strong>
        </p>

        <input
          type="text"
          placeholder="Enter Device ID (SOLAR-XXXX)"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '8px',
            border: 'none',
            boxSizing: 'border-box',
          }}
        />

        <button
          onClick={handleRegistration}
          disabled={loading || !deviceId}
          style={{
            width: '100%',
            padding: '15px',
            background: loading ? '#666' : '#ffd700',
            color: 'black',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing...' : `Pay ${symbol}${price} to Activate`}
        </button>
      </div>
    </div>
  );
}

export default App;
