import { Recycle, CheckCircle, Smartphone } from 'lucide-react';
import { useEcoRewards } from './hooks/useEcoRewards';

const EcoRewards = () => {
  const { logged, handleRecycle } = useEcoRewards();

  return (
    <div className="glass-card eco-rewards-card">
      <div className="flex-between header">
        <h3>
          <Recycle className="text-secondary icon" color="#10b981" /> Eco-Rewards Hub
        </h3>
        <span className="badge">Drop-off Point</span>
      </div>

      <div className="content">
        <p className="description">
          Dispose of old electronics securely at Stadium Smart Bins. Earn Team Loyalty Points instantly!
        </p>

        {!logged ? (
          <button 
            className="btn action-btn" 
            onClick={handleRecycle}
            data-testid="simulate-ewaste-btn"
            aria-label="Simulate Electronic Waste Deposit"
          >
            <Smartphone size={16} aria-hidden="true" /> Simulate E-Waste Deposit
          </button>
        ) : (
          <div className="success-msg" data-testid="success-msg" role="status" aria-live="polite">
            <CheckCircle size={18} aria-hidden="true" /> Points Added! (+250 XP)
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoRewards;
