import { MapPin, Navigation, Map } from 'lucide-react';
import { useVenueStore } from '../store/useVenueStore';

const SmartNavigation = () => {
  const { gateBStatus } = useVenueStore();

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Map className="text-secondary" /> Smart Routing
        </h3>
        <span style={{ fontSize: '0.7rem', background: 'var(--accent-cyan)', color: '#000', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Beta AR</span>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Simple map mock */}
        <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1, pointerEvents: 'none' }}>
           <svg width="200" height="150" viewBox="0 0 200 150">
             <path 
               d={gateBStatus === 'clear' ? "M 0,150 Q 50,50 200,0" : "M 0,150 Q 150,150 200,50"} 
               fill="none" 
               stroke="#fff" 
               strokeWidth="20" 
               style={{ transition: 'all 0.5s ease' }}
             />
           </svg>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--text-secondary)' }} />
             <div style={{ width: '2px', height: '30px', background: 'var(--text-muted)' }} />
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-magenta)', boxShadow: '0 0 10px var(--accent-magenta)' }} />
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.2rem' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Location</p>
              <p style={{ fontWeight: '500' }}>Entrance Plaza</p>
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Destination</p>
              <p style={{ fontWeight: '500' }}>Section 104, Seat 12</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: gateBStatus === 'clear' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(236, 72, 153, 0.1)', border: `1px solid ${gateBStatus === 'clear' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`, padding: '1rem', borderRadius: 'var(--radius-sm)', marginTop: '1rem', display: 'flex', gap: '1rem', transition: 'all 0.3s ease' }}>
        <Navigation size={24} color={gateBStatus === 'clear' ? 'var(--accent-cyan)' : 'var(--accent-magenta)'} />
        <div>
          <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: gateBStatus === 'clear' ? 'var(--accent-cyan)' : 'var(--accent-magenta)' }}>
            {gateBStatus === 'clear' ? 'AI Route Optimized' : 'Route Recalculated!'}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {gateBStatus === 'clear' ? 'Direct route to Gate B. +1 min saved.' : 'Dodging new congestion at Gate B. Rerouting via Gate A. +3 mins saved.'}
          </p>
        </div>
      </div>

      <button 
        className="btn btn-primary" 
        style={{ width: '100%', marginTop: '1rem', gap: '8px' }}
        onClick={() => useVenueStore.getState().setArNavigationActive(true)}
      >
        <MapPin size={16} /> Start AR Navigation
      </button>
    </div>
  );
};

export default SmartNavigation;
