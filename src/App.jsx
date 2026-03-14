import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useState } from 'react';
import brain from 'brain.js';

function SolarPanel({ position }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <MeshDistortMaterial color="#00ff88" distort={0.4} speed={2} />
      </mesh>
    </group>
  );
}

function App() {
  const [deviceId, setDeviceId] = useState('');
  const [status, setStatus] = useState('Scan QR to register solar panel');
  const [fraudScore, setFraudScore] = useState(null);

  const net = new brain.NeuralNetwork();
  net.fromJSON(require('./fraud-model.json')); // Add model later

  const registerDevice = async () => {
    if (!deviceId) return;
    
    const response = await fetch('/api/server', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register-device', deviceId })
    });
    
    const data = await response.json();
    setStatus(data.message || data.error);
    
    if (data.success) {
      const score = net.run({ deviceId, timestamp: Date.now() });
      setFraudScore(score.fraud);
    }
  };

  return (
    <div style={{ height: '100vh', background: '#000011' }}>
      <div style={{ position: 'absolute', zIndex: 1, color: 'white', padding: '20px' }}>
        <h1 style={{ fontSize: '2em', margin: 0 }}>🌞 SolarPayGo AI</h1>
        <p>{status}</p>
        {fraudScore && <p>🛡️ Fraud Score: {(fraudScore * 100).toFixed(1)}%</p>}
        <input
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          placeholder="Enter QR Device ID (SOLAR-XXXX)"
          style={{ padding: '10px', fontSize: '16px', width: '300px' }}
        />
        <button onClick={registerDevice} style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Register & Pay $29.99/mo
        </button>
      </div>
      
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <SolarPanel position={[-2, 0, 0]} />
        <SolarPanel position={[2, 0, 0]} />
        <Sphere args={[0.5]} position={[0, -1, 0]}>
          <meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={0.5} />
        </Sphere>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;