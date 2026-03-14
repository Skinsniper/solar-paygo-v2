// Use your actual Stripe Public Key
const stripePromise = loadStripe(
  'pk_test_51SwS6rRYjVQJNcqWtPc3OFy42i73ZvOKINA7vAnb9G5jcEGCB0QlNgjLpeibFNeLXOXfX08WRXiolLxcAyYChxOM00QuTl7lix',
);

function App() {
  const [deviceId, setDeviceId] = useState('');
  const [status, setStatus] = useState('🌞 SolarPayGo - Register Device');
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [price, setPrice] = useState(29.99);
  const [symbol, setSymbol] = useState('$');

  const canvasRef = useRef();

  // Mapping Countries to Currencies
  const currencyMap = {
    US: { code: 'USD', symbol: '$', price: 29.99 },
    GB: { code: 'GBP', symbol: '£', price: 24.99 },
    IN: { code: 'INR', symbol: '₹', price: 2499 },
    BR: { code: 'BRL', symbol: 'R$', price: 159.99 },
    EU: { code: 'EUR', symbol: '€', price: 27.99 },
  };

  // NEW: Detect user location via Vercel Edge headers (via your backend)
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch('/api/server?action=get-geo');
        const data = await res.json();
        const geo = data.country || 'US';
        const config = currencyMap[geo] || currencyMap['US'];

        setCurrency(config.code);
        setPrice(config.price);
        setSymbol(config.symbol);
      } catch (e) {
        console.error('Geo-detection failed, defaulting to USD');
      }
    };
    detectLocation();
  }, []);

  // 3D Solar Farm Animation (Remains same)
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
    const panelGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const panelMaterial = new THREE.MeshPhongMaterial({ color: 0x4a7c59 });
    const panels = [];
    for (let i = 0; i < 12; i++) {
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.set(((i % 4) - 1.5) * 3, 0, Math.floor(i / 4 - 1.5) * 3);
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
    if (!deviceId) return alert('Please enter a Device ID');
    setLoading(true);
    setStatus('🔄 Contacting Secure Server...');
    try {
      const response = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register-device',
          deviceId,
          currency: currency.toLowerCase(),
          amount: Math.round(price * 100),
        }),
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
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <header>
        <h1 style={{ fontSize: '3rem', color: '#ffd700', margin: '10px 0' }}>
          🌞 SolarPayGo AI
        </h1>
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
