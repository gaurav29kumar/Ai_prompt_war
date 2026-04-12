import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Cpu, ArrowRightLeft, Bell, BatteryCharging, AlertOctagon, X, ExternalLink } from 'lucide-react';
import { useVenueStore } from '../store/useVenueStore';

const AIAutopilot = () => {
  const alerts = useVenueStore(state => state.alerts);
  const infractions = useVenueStore(state => state.infractions);
  const [showFullLog, setShowFullLog] = useState(false);

  const fullEventLog = useMemo(() => {
    return [...alerts, ...infractions].sort((a: unknown, b: unknown) => (b as {id: number}).id - (a as {id: number}).id);
  }, [alerts, infractions]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'congestion': return <ArrowRightLeft size={18} color="var(--accent-cyan)" />;
      case 'supply': return <BatteryCharging size={18} color="var(--primary)" />;
      case 'sentiment': return <Bell size={18} color="var(--secondary)" />;
      default: return <Bell size={18} color="var(--text-secondary)" />;
    }
  };

  return (
    <>
      <div className="glass-card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Cpu className="text-gradient" /> Neural Autopilot
        </h3>
        <span style={{ fontSize: '0.8rem', background: 'var(--accent-cyan)', color: '#000', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>ACTIVE</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '420px', paddingRight: '0.5rem' }}>
        {alerts.map((alert) => (
          <div key={alert.id} style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-sm)',
            borderLeft: alert.autoAction ? '3px solid var(--accent-cyan)' : '3px solid var(--text-muted)',
            animation: 'fadeIn 0.5s ease-out',
            flexShrink: 0
          }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {getIcon(alert.type)}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{alert.time}</span>
              </div>
              {alert.autoAction && (
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', border: '1px solid var(--accent-cyan)', padding: '2px 6px', borderRadius: '4px' }}>
                  AUTO-RESOLVED
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{alert.message}</p>
          </div>
        ))}

        {infractions && infractions.length > 0 && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#f59e0b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertOctagon size={16} /> Security & Policy Infractions
            </h4>
            {infractions.map(inf => (
              <div key={inf.id} style={{
                background: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '0.75rem'
              }}>
                <div className="flex-between">
                  <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#f59e0b' }}>{inf.type}</span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(245,158,11,0.2)', padding: '2px 6px', borderRadius: '4px' }}>{inf.status.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Location: {inf.location} • Source: {inf.evidence}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', gap: '8px', transition: 'all 0.3s ease' }}
            onClick={() => setShowFullLog(true)}
          >
            <ExternalLink size={16} /> View Full Event Log
          </button>
        </div>
      </div>

      {/* Full Event Log Modal Overlay via Portal to prevent layout clipping */}
      {showFullLog && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(10, 11, 16, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-slide-up" style={{ width: '90%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column', padding: '2rem', border: '1px solid var(--accent-cyan)' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Cpu /> Global Brain Event Log</h2>
              <button className="btn btn-secondary" onClick={() => setShowFullLog(false)}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Combine both feeds for the "Full Log" efficiently cached */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {fullEventLog.map((item: any) => (
                <div key={`${item.type}-${item.id}`} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', height: 'fit-content' }}>
                    {item.location ? <AlertOctagon color="#f59e0b" /> : getIcon(item.type)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: item.location ? '#f59e0b' : 'var(--accent-cyan)' }}>{item.type.toUpperCase()}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Event ID: {item.id} | TS: {item.time ? item.time : 'Historical'}</span>
                    </div>
                    <p style={{ fontSize: '1rem' }}>{item.message || `Infraction detected: ${item.type} at ${item.location}`}</p>
                    <div style={{ marginTop: '0.5rem' }}>
                       {item.autoAction && <span style={{ fontSize: '0.75rem', background: 'var(--accent-cyan)', color: 'black', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>AUTO-RESOLVED</span>}
                       {item.status && <span style={{ fontSize: '0.75rem', background: '#f59e0b', color: 'black', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{item.status.toUpperCase()}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default React.memo(AIAutopilot);
