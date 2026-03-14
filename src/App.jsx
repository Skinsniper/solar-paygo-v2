import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51SwS6rRYjVQJNcqWtPc3OFy42i73ZvOKINA7vAnb9G5jcEGCB0QlNgjLpeibFNeLXOXfX08WRXiolLxcAyYChxOM00QuTl7lix',
);

function App() {
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [price, setPrice] = useState(29.99);
  const [status, setStatus] = useState('🌞 SolarPayGo - Ready');
  const canvasRef = useRef();

  const currencies = [
    { code: 'USD', symbol: '$', price: 29.99 },
    { code: 'EUR', symbol: '€', price: 27.99 },
    { code: 'GBP', symbol: '£', price: 24.99 },
    { code: 'INR', symbol: '₹', price: 2499 },
    { code: 'BRL', symbol: 'R$', price: 159.99 },
  ];

  // 1. Voice Command Feature
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.onresult = (event) => {
      const command =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (command.includes('activate') || command.includes('pay')) {
        handlePayment();
      }
    };
    try {
      recognition.start();
    } catch (e) {
      console.log('Mic busy');
    }
  }, []);

  // 2. 3D Solar Farm Animation
  useEffect(() => {
    if (!window.THREE || !canvasRef.current) return;
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(400, 300);

    const panels = [];
    const geom = new THREE.BoxGeometry(2, 0.1, 1);
    const mat = new THREE.MeshPhongMaterial({ color: 0x4a7c59 });

    for (let i = 0; i < 9; i++) {
      const panel = new THREE.Mesh(geom, mat);
      panel.position.set(((i % 3) - 1) * 3, 0, Math.floor(i / 3 - 1) * 3);
      scene.add(panel);
      panels.push(panel);
    }

    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(5, 10, 5);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x404040));
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      panels.forEach((p, i) => {
        p.rotation.y = Math.sin(Date.now() * 0.001 + i) * 0.1;
      });
      renderer.render(scene, camera);
    };
    animate();
    return () => renderer.dispose();
  }, []);

  // 3. Payment Logic
  const handlePayment = async () => {
    if (!deviceId) return alert('Enter device ID first!');
    setLoading(true);
    setStatus('🔄 Initializing Stripe...');
    try {
      const res = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          currency,
          amount: Math.round(price * 100),
        }),
      });
      const data = await res.json();
      const stripe = await stripePromise;
      const { error } = await stripe.confirmCardPayment(data.clientSecret);
      setStatus(error ? '❌ ' + error.message : '✅ Power Activated!');
    } catch (e) {
      setStatus('❌ Network error');
    }
    setLoading(false);
  };

  const selectedCurrency =
    currencies.find((c) => c.code === currency) || currencies[0];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
        color: 'white',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1
        style={{
          background: 'linear-gradient(45deg, #ffd700, #fff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '3rem',
        }}
      >
        🌞 SolarPayGo AI
      </h1>

      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          height: '300px',
          borderRadius: '20px',
          margin: '20px 0',
        }}
      />

      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '30px',
          borderRadius: '25px',
          maxWidth: '450px',
          margin: '0 auto',
          backdropFilter: 'blur(10px)',
        }}
      >
        <h2>{status}</h2>

        <div style={{ marginBottom: '15px' }}>
          <select
            value={currency}
            onChange={(e) => {
              const c = currencies.find((curr) => curr.code === e.target.value);
              setCurrency(c.code);
              setPrice(c.price);
            }}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
            }}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol}
                {c.price} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Enter Device ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          style={{
            width: '95%',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '10px',
            border: 'none',
          }}
        />

        <button
          onClick={handlePayment}
          disabled={loading || !deviceId}
          style={{
            width: '100%',
            padding: '18px',
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            color: 'black',
            border: 'none',
            borderRadius: '15px',
            fontWeight: 'bold',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          {loading
            ? 'Processing...'
            : `Pay ${selectedCurrency.symbol}${price} to Activate`}
        </button>
      </div>

      <div style={{ marginTop: '30px', opacity: 0.8 }}>
        🎤 Voice Commands: Try saying "Activate"
      </div>
    </div>
  );
}

export default App;
