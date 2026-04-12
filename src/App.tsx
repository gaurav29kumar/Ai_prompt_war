import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import { useEffect } from 'react';
import { useVenueStore } from './store/useVenueStore';

// Lazy loaded boundaries massively scaling first paint metrics
const Portal = React.lazy(() => import('./pages/Portal'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const FanApp = React.lazy(() => import('./pages/FanApp'));

function App() {
  const initSocket = useVenueStore(state => state.initSocket);

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  return (
    <Router>
      <Suspense fallback={
        <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
           <div className="animate-pulse-glow" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px dashed var(--accent-cyan)' }}></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Portal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fan-app" element={<FanApp />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
