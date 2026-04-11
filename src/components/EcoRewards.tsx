import { useState } from 'react';
import { Recycle, CheckCircle, Smartphone } from 'lucide-react';
import { useVenueStore } from '../store/useVenueStore';

const EcoRewards = () => {
  const { reportEWaste } = useVenueStore();
  const [logged, setLogged] = useState(false);

  const handleRecycle = () => {
    reportEWaste(2.5); // Randomly logged a 2.5kg deposit (e.g., an old laptop or tablet)
    setLogged(true);
    setTimeout(() => setLogged(false), 3000);
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: '#10b981' }}>
          <Recycle className="text-secondary" color="#10b981" /> Eco-Rewards Hub
        </h3>
        <span style={{ fontSize: '0.7rem', background: '#10b981', color: '#000', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Drop-off Point</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Dispose of old electronics securely at Stadium Smart Bins. Earn Team Loyalty Points instantly!
        </p>

        {!logged ? (
          <button 
            className="btn" 
            style={{ width: '100%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid #10b981' }}
            onClick={handleRecycle}
          >
            <Smartphone size={16} /> Simulate E-Waste Deposit
          </button>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', background: '#10b981', color: '#000', borderRadius: 'var(--radius-sm)', fontWeight: 'bold' }}>
            <CheckCircle size={18} /> Points Added! (+250 XP)
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoRewards;
