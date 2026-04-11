import { useNavigate } from 'react-router-dom';
import { Activity, User } from 'lucide-react';

const Portal = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-panel animate-slide-up" style={{ maxWidth: '900px', width: '100%', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>NeuroVenue</h1>
          <p className="subtitle">The intelligent, adaptive stadium ecosystem.</p>
        </div>

        <div className="grid-cols-2">
          {/* Organizer Dashboard Card */}
          <div 
            className="glass-card" 
            style={{ padding: '2.5rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
            onClick={() => navigate('/dashboard')}
          >
            <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary-glow)' }} className="animate-pulse-glow">
              <Activity size={48} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Organizer Dashboard</h2>
              <p className="subtitle" style={{ fontSize: '0.95rem' }}>
                Monitor crowd heatmaps, manage virtual queues, and control the AI auto-pilot in real-time.
              </p>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 'auto' }}>Enter Dashboard</button>
          </div>

          {/* Fan Experience Card */}
          <div 
            className="glass-card" 
            style={{ padding: '2.5rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
            onClick={() => navigate('/fan-app')}
          >
            <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--secondary)', border: '1px solid var(--secondary-glow)' }}>
              <User size={48} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Fan Experience</h2>
              <p className="subtitle" style={{ fontSize: '0.95rem' }}>
                Navigate smart routes, join virtual queues, and explore the AR stadium layer.
              </p>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 'auto', background: 'linear-gradient(135deg, var(--secondary), var(--accent-magenta))', boxShadow: '0 4px 14px var(--secondary-glow)' }}>Launch App</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;
