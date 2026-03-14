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
          import { useState, useEffect, useRef } from 'react';
          import { loadStripe } from '@stripe/stripe-js';

          // Initialize Stripe outside the component to prevent re-renders
          const stripePromise = loadStripe('pk_test_51...YOUR_PUBLIC_KEY'); 

          function App() {
            const [deviceId, setDeviceId] = useState('');
            const [status, setStatus] = useState('🌞 SolarPayGo - Register Device');
            const [loading, setLoading] = useState(false);
            const [currency, setCurrency] = useState('USD');
            const [price, setPrice] = useState(29.99);
  
            const canvasRef = useRef();

            const currencies = [
              { code: 'USD', symbol: '$', price: 29.99 },
              { code: 'EUR', symbol: '€', price: 27.99 },
              { code: 'GBP', symbol: '£', price: 24.99 },
              { code: 'INR', symbol: '₹', price: 2499 },
              { code: 'BRL', symbol: 'R$', price: 159.99 }
            ];

            // 3D Solar Farm Animation
            useEffect(() => {
              if (!window.THREE || !canvasRef.current) return;

              const THREE = window.THREE;
              const scene = new THREE.Scene();
              const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
              const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
              renderer.setSize(400, 300);

              const panelGeometry = new THREE.BoxGeometry(2, 0.1, 1);
              const panelMaterial = new THREE.MeshPhongMaterial({ color: 0x4a7c59 });
              const panels = [];

              for (let i = 0; i < 12; i++) {
                const panel = new THREE.Mesh(panelGeometry, panelMaterial);
                panel.position.set((i % 4 - 1.5) * 3, 0, Math.floor(i / 4 - 1.5) * 3);
                panel.rotation.x = -0.1;
                scene.add(panel);
                panels.push(panel);
              }

              const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
              scene.add(ambientLight);
              const sunLight = new THREE.DirectionalLight(0xffffff, 1);
              sunLight.position.set(10, 10, 5);
              scene.add(sunLight);

              camera.position.z = 8;
              camera.position.y = 2;

              let time = 0;
              const animate = () => {
                requestAnimationFrame(animate);
                time += 0.01;
                panels.forEach((panel, i) => {
                  panel.rotation.y = Math.sin(time + i * 0.2) * 0.05;
                  panel.position.y = Math.sin(time * 2 + i) * 0.02;
                });
                renderer.render(scene, camera);
              };
              animate();

              return () => renderer.dispose();
            }, []);

            const handleRegistration = async () => {
              setLoading(true);
              setStatus('🔄 Contacting Secure Server...');
    
              try {
                const response = await fetch('/api/server', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    action: 'register-device', 
                    deviceId: deviceId,
                    currency: currency,
                    amount: price * 100 
                  })
                });
      
                const data = await response.json();
      
                if (data.clientSecret) {
                  const stripe = await stripePromise;
                  const { error } = await stripe.confirmCardPayment(data.clientSecret);
        
                  if (!error) {
                    setStatus('✅ Payment complete! Device activated.');
                  } else {
                    setStatus('❌ Payment failed: ' + error.message);
                  }
                } else {
                  setStatus(data.message || 'Error processing request');
                }
              } catch (err) {
                setStatus('Network error: ' + err.message);
              }
              setLoading(false);
            };

            return (
              <div style={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                color: 'white',
                fontFamily: 'system-ui, sans-serif',
                padding: '20px',
                textAlign: 'center'
              }}>
                <header>
                  <h1 style={{ fontSize: '3rem', color: '#ffd700', marginBottom: '0' }}>🌞 SolarPayGo AI</h1>
                  <p style={{ opacity: 0.8 }}>Pay-as-you-go Solar Energy • AI Fraud Protection</p>
                </header>

                <div style={{ margin: '20px auto' }}>
                  <canvas ref={canvasRef} style={{ borderRadius: '20px', maxWidth: '100%' }} />
                </div>

                <div style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '30px', 
                  borderRadius: '20px', 
                  maxWidth: '450px', 
                  margin: '0 auto',
                  backdropFilter: 'blur(10px)'
                }}>
                  <h2 style={{ fontSize: '1.5rem' }}>{status}</h2>
        
                  <select 
                    value={currency} 
                    onChange={(e) => {
                      const selected = currencies.find(c => c.code === e.target.value);
                      setCurrency(selected.code);
                      setPrice(selected.price);
                    }}
                    style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px' }}
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.symbol}{c.price} ({c.code})</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Enter Device ID (e.g. SOLAR-123)"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', boxSizing: 'border-box' }}
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
                      cursor: 'pointer'
                    }}
                  >
                    {loading ? 'Processing...' : 'Activate Now'}
                  </button>
                </div>
              </div>
            );
          }

          export default App;
                  { code: 'INR', symbol: '₹', price: 2499 },
                  { code: 'BRL', symbol: 'R$', price: 159.99 }
                ];

                return (
                  <div style={{ 
                    minHeight: '100vh', 
                    background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                    color: 'white',
                    fontFamily: 'system-ui, sans-serif',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <header style={{ marginBottom: '30px' }}>
                      <div style={{
                        fontSize: '48px',
                        background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                        textShadow: '0 0 30px rgba(255,215,0,0.5)'
                      }}>
                        🌞 SolarPayGo AI
                      </div>
                      <p style={{ fontSize: '18px', opacity: 0.9, margin: '10px 0' }}>
                        Pay-as-you-go Solar Energy • AI Fraud Protection • Instant Activation
                      </p>
                    </header>

                    {/* 3D Solar Farm */}
                    <div style={{ margin: '40px 0', position: 'relative' }}>
                      <canvas 
                        ref={canvasRef} 
                        style={{ 
                          borderRadius: '20px', 
                          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                          maxWidth: '100%',
                          height: '300px'
                        }} 
                      />
                      <div style={{
                        position: 'absolute',
                        top: '20px', right: '20px',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '10px 15px',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}>
                        🔋 Live Energy Flow
                      </div>
                    </div>

                    {/* Client Explanations */}
                    <div style={{ maxWidth: '800px', margin: '0 auto 40px', textAlign: 'left' }}>
                      <h2 style={{ fontSize: '28px', marginBottom: '20px', textAlign: 'center' }}>How It Works</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                          <h3>📱 Scan QR Code</h3>
                          <p>Generate unique QR for your device. Scan with phone camera or enter device ID manually.</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                          <h3>💳 Pay Once</h3>
                          <p>$29.99 activates unlimited kWh for 30 days. Local currency pricing. No contracts.</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                          <h3>⚡ Instant Power</h3>
                          <p>AI verifies payment, device activates immediately. Real-time kWh tracking.</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                          <h3>🛡️ AI Fraud Protection</h3>
                          <p>Neural network detects fake payments. 99.9% accuracy.</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Form */}
                    <div style={{ 
                      background: 'rgba(255,255,255,0.1)', 
                      padding: '40px', 
                      borderRadius: '25px', 
                      maxWidth: '500px', 
                      margin: '0 auto 40px',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                    }}>
                      <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>Activate Your Device</h2>
        
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Currency</label>
                        <select 
                          value={currency} 
                          onChange={(e) => {
                            const selected = currencies.find(c => c.code === e.target.value);
                            setCurrency(selected.code);
                            setPrice(selected.price);
                          }}
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '10px', 
                            border: 'none',
                            background: 'rgba(255,255,255,0.9)',
                            fontSize: '16px'
                          }}
                        >
                          {currencies.map(c => (
                            <option key={c.code} value={c.code}>{c.symbol}{c.price} ({c.code})</option>
                          ))}
                        </select>
                      </div>

                      <input
                        type="text"
                        placeholder="Enter Device ID or Scan QR"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '15px',
                          marginBottom: '20px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '16px',
                          background: 'rgba(255,255,255,0.9)'
                        }}
                      />

                      <button
                        onClick={handlePayment}
                        disabled={loading || !deviceId}
                        style={{
                          width: '100%',
                          padding: '18px',
                          background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                          color: '#000',
                          border: 'none',
                          borderRadius: '15px',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          cursor: loading || !deviceId ? 'not-allowed' : 'pointer',
                          opacity: loading || !deviceId ? 0.6 : 1
                        }}
                      >
                        {loading ? 'Processing...' : `${currencies.find(c => c.code === currency).symbol}${price} Activate Now`}
                      </button>

                      {paymentIntent && (
                        <div id="stripe-element" style={{ marginTop: '20px' }} />
                      )}
                    </div>

                    {/* PWA Install & Voice */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '20px', 
                      justifyContent: 'center', 
                      flexWrap: 'wrap',
                      marginTop: '40px'
                    }}>
                      <button 
                        onClick={() => window.open('/manifest.json')} 
                        style={{
                          padding: '15px 25px',
                          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        📱 Install App
                      </button>
                      <button 
                        onClick={() => {
                          const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                          recognition.start();
                        }}
                        style={{
                          padding: '15px 25px',
                          background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        🎤 Voice Activate
                      </button>
                    </div>

                    <p style={{ marginTop: '40px', opacity: 0.7, fontSize: '14px' }}>
                      Secure payments by Stripe • AI-powered by brain.js • 24/7 monitoring
                    </p>
                  </div>
                );
              }

              export default App;