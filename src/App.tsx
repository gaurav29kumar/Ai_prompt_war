import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Portal from './pages/Portal';
import Dashboard from './pages/Dashboard';
import FanApp from './pages/FanApp';

import { useEffect } from 'react';
import { useVenueStore } from './store/useVenueStore';

function App() {
  const { initSocket } = useVenueStore();

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fan-app" element={<FanApp />} />
      </Routes>
    </Router>
  );
}

export default App;
