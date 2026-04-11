import { Clock, Coffee, Bell } from 'lucide-react';
import { useVenueStore } from '../store/useVenueStore';

const VirtualQueue = () => {
  const { virtualQueueStatus, setVirtualQueueStatus } = useVenueStore();

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Coffee className="text-secondary" /> Express Concessions
        </h3>
        {virtualQueueStatus === 'ready' && (
           <span className="animate-pulse-glow" style={{ fontSize: '0.7rem', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>READY</span>
        )}
      </div>
      
      {virtualQueueStatus === 'idle' && (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <p className="subtitle" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Skip the physical line. We'll notify you when your order is ready for pickup.
          </p>
          <div className="flex-center" style={{ gap: '2rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>5 min</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Wait</span>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>32</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In Queue</span>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setVirtualQueueStatus('joined')}>
            Join Virtual Queue
          </button>
        </div>
      )}
      
      {virtualQueueStatus === 'joined' && (
        <div style={{ textAlign: 'center', padding: '1rem 0', animation: 'fadeIn 0.5s ease' }}>
          <div className="animate-pulse-glow" style={{ width: '60px', height: '60px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Clock size={32} color="var(--primary)" />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>You're in line!</h3>
          <p className="subtitle" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
             Your pickup code is <strong style={{ color: 'white' }}>B42</strong>. Wait for the notification.
          </p>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
             <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</p>
             <p style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>Preparing Order...</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setVirtualQueueStatus('ready')}>
              Simulate Ready
            </button>
            <button className="btn" style={{ background: 'rgba(236,72,153,0.1)', color: 'var(--accent-magenta)', flex: 1 }} onClick={() => setVirtualQueueStatus('idle')}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {virtualQueueStatus === 'ready' && (
        <div style={{ textAlign: 'center', padding: '1rem 0', animation: 'fadeIn 0.5s ease' }}>
          <div className="animate-pulse-glow" style={{ width: '60px', height: '60px', background: 'rgba(59, 130, 246, 0.2)', border: '2px solid var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Bell size={32} color="var(--primary)" />
          </div>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Order Ready!</h3>
          <p className="subtitle" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
             It's time! Show code <strong style={{ color: 'white', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>B42</strong> at Pickup Counter 3.
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setVirtualQueueStatus('idle')}>
            Complete Order
          </button>
        </div>
      )}
    </div>
  );
};

export default VirtualQueue;
