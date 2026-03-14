import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51SwS6rRYjVQJNcqWtPc3OFy42i73ZvOKINA7vAnb9G5jcEGCB0QlNgjLpeibFNeLXOXfX08WRXiolLxcAyYChxOM00QuTl7lix');

/**
 * The main App component.
 *
 * This component renders the SolarPayGo AI interface, which includes a canvas for a spinning panel, a status message, a price display, a device ID input field, and an activate button.
 *
 * It also handles the payment process by calling the Stripe API.
 */
function App() {
  const [deviceId, setDeviceId] = useState('');
  const [status, setStatus] = useState('🌞 SolarPayGo - Ready');
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [price, setPrice] = useState(29.99);
  const [symbol, setSymbol] = useState('$');
  const canvasRef = useRef();

  const currencyMap = {
    'US': { code: 'usd', symbol: '$', price: 29.99 },
    'GB': { code: 'gbp', symbol: '£', price: 24.99 },
    'IN': { code: 'inr', symbol: '₹', price: 2499 },
    'BR': { code: 'brl', symbol: 'R$', price: 159.99 },
    'EU': { code: 'eur', symbol: '€', price: 27.99 }
    // Styles defined outside JSX to prevent parser confusion
    const containerStyle = { minHeight: '100vh', background: '#0f2027', color: 'white', textAlign: 'center', padding: '20px', fontFamily: 'sans-serif' };
    const cardStyle = { background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', maxWidth: '400px', margin: '20px auto', backdropFilter: 'blur(10px)' };
    const inputStyle = { width: '90%', padding: '10px', marginBottom: '10px', borderRadius: '5px' };
    const buttonStyle = { width: '95%', padding: '15px', background: '#ffd700', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: 'black' };
        const config = currencyMap[geo] || currencyMap['US'];
        setCurrency(config.code);
        setPrice(config.price);
        setSymbol(config.symbol);
      })
      .catch(() => console.log("Defaulting to USD"));
          const config = {
            'US': { code: 'usd', symbol: '$', price: 29.99 },
            'GB': { code: 'gbp', symbol: '£', price: 24.99 },
            'IN': { code: 'inr', symbol: '₹', price: 2499 },
            'EU': { code: 'eur', symbol: '€', price: 27.99 }
          }[geo] || { code: 'usd', symbol: '$', price: 29.99 };

  useEffect(() => {
    if (!window.THREE || !canvasRef.current) return;
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(400, 300);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1), new THREE.MeshPhongMaterial({ color: 0x00ff88 }));
    scene.add(panel);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));
    camera.position.z = 5;
/**
 * Recursively renders the scene and updates the panel's rotation.
 * Uses requestAnimationFrame to schedule the next frame.
 */
    const animate = () => {
      requestAnimationFrame(animate);
      panel.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
    return () => renderer.dispose();
  }, []);

  /**
      <div style={containerStyle}>
   * If the user has not entered a Device ID, it will alert the user to enter one.
   * It will then set the status to "Initializing Stripe..." and start the payment process.
   * If the payment is successful, it will set the status to "Activated!".
        <div style={cardStyle}>
   * Finally, it will set the loading state to false.
   */
  const handlePayment = async () => {
    if (!deviceId) return alert("Please enter a Device ID");
    setLoading(true);
    setStatus('🔄 Initializing Stripe...');
    try {
      const response = await fetch('/api/server', {
            style={inputStyle}
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register-device', deviceId, currency, amount: Math.round(price * 100) })
      });
      const data = await response.json();
      const stripe = await stripePromise;
            style={buttonStyle}
      if (error) setStatus('❌ ' + error.message);
      else setStatus('✅ Activated!');
    } catch (err) {
      setStatus('❌ Payment Failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f2027', color: 'white', textAlign: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🌞 SolarPayGo AI</h1>
      <canvas ref={canvasRef} style={{ maxWidth: '100%', height: '300px', margin: '20px 0' }} />
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', maxWidth: '400px', margin: '0 auto' }}>
        <h2>{status}</h2>
        <p>Price: {symbol}{price}</p>
        <input
          type="text"
          placeholder="Device ID"
          value={deviceId}
          onChange={(e) => { setDeviceId(e.target.value); }}
          style={{ width: '90%', padding: '10px', marginBottom: '10px' }}
        />
        <button
          onClick={() => { handlePayment(); }}
          disabled={loading || !deviceId}
          style={{ width: '95%', padding: '15px', background: '#ffd700', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          {loading ? 'Processing...' : 'Activate Now'}
        </button>
      </div>
    </div>
  );
}

export default App;