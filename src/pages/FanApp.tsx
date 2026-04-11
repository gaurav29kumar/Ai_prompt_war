
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Ticket, Flame } from 'lucide-react';
import VirtualQueue from '../components/VirtualQueue';
import SmartNavigation from '../components/SmartNavigation';
import AROverlayMock from '../components/AROverlayMock';
import EcoRewards from '../components/EcoRewards';

const FanApp = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <header className="flex-between glass-panel" style={{ padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/')} className="btn" style={{ background: 'transparent', padding: '8px' }}>
            <ChevronLeft size={24} /> Back
          </button>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
          <h2 className="text-gradient">Fan Dashboard: Alex</h2>
        </div>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px var(--primary-glow)' }}>
           <Ticket size={20} color="white" />
        </div>
      </header>

      {/* Main Grid */}
      <main style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem' }} className="animate-slide-up">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ background: 'linear-gradient(90deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
            <Flame color="var(--accent-magenta)" size={40} className="animate-pulse-glow" />
            <div>
              <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Match is heating up!</p>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Get a drink, it's halftime soon.</p>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Your Journey</h3>
            <SmartNavigation />
          </div>
          
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Services</h3>
            <VirtualQueue />
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h3 id="ar-view" style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Stadium AR</h3>
            <AROverlayMock />
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Green Team</h3>
            <EcoRewards />
          </div>
        </div>

      </main>
    </div>
  );
};

export default FanApp;
