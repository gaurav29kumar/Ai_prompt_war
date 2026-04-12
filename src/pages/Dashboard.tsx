import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Settings, AlertTriangle, X } from 'lucide-react';
import CrowdHeatmap from '../components/CrowdHeatmap';
import AIAutopilot from '../components/AIAutopilot';
import MiniSparkline from '../components/MiniSparkline';
import { useVenueStore } from '../store/useVenueStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const gateBStatus = useVenueStore(state => state.gateBStatus);
  const simulateCongestion = useVenueStore(state => state.simulateCongestion);
  const resolveCongestion = useVenueStore(state => state.resolveCongestion);
  const capacityPct = useVenueStore(state => state.capacityPct);
  const estWaitTime = useVenueStore(state => state.estWaitTime);
  const carbonOffset = useVenueStore(state => state.carbonOffset);
  const aiReroutingActive = useVenueStore(state => state.aiReroutingActive);
  const dynamicPricingActive = useVenueStore(state => state.dynamicPricingActive);
  const arBetaActive = useVenueStore(state => state.arBetaActive);
  const toggleSetting = useVenueStore(state => state.toggleSetting);
  const [showSettings, setShowSettings] = useState(false);
  const [diagnosticsState, setDiagnosticsState] = useState<'idle' | 'running' | 'success'>('idle');

  const handleSimulateCongestion = () => {
    if (gateBStatus === 'clear') {
      simulateCongestion();
    } else {
      resolveCongestion();
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
      
      {/* Settings Modal Mock */}
      {showSettings && (
        <div style={{ position: 'absolute', top: '4rem', right: '2rem', zIndex: 100, background: 'rgba(20, 24, 39, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', width: '300px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', animation: 'fadeIn 0.2s ease' }}>
          <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>System Settings</h3>
            <button className="btn" onClick={() => setShowSettings(false)} style={{ background: 'transparent', padding: '4px' }}><X size={16}/></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div className="flex-between">
               <span style={{ fontSize: '0.9rem' }}>AI Auto-Rerouting</span>
               <input type="checkbox" checked={aiReroutingActive} onChange={(e) => toggleSetting('aiReroutingActive', e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
             </div>
             <div className="flex-between">
               <span style={{ fontSize: '0.9rem' }}>Dynamic Pricing Sync</span>
               <input type="checkbox" checked={dynamicPricingActive} onChange={(e) => toggleSetting('dynamicPricingActive', e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
             </div>
             <div className="flex-between">
               <span style={{ fontSize: '0.9rem' }}>AR Overlay Beta</span>
               <input type="checkbox" checked={arBetaActive} onChange={(e) => toggleSetting('arBetaActive', e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
             </div>
             <button 
               className="btn btn-secondary" 
               style={{ marginTop: '1rem', width: '100%', borderColor: diagnosticsState === 'success' ? '#10b981' : 'var(--border-color)', color: diagnosticsState === 'success' ? '#10b981' : 'white' }}
               onClick={() => {
                 setDiagnosticsState('running');
                 setTimeout(() => setDiagnosticsState('success'), 2000);
                 setTimeout(() => setDiagnosticsState('idle'), 4000);
               }}
               disabled={diagnosticsState !== 'idle'}
             >
               {diagnosticsState === 'idle' && 'Restart Diagnostics'}
               {diagnosticsState === 'running' && 'Running...'}
               {diagnosticsState === 'success' && 'Systems Nominal ✓'}
             </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex-between glass-panel" style={{ padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/')} className="btn" style={{ background: 'transparent', padding: '8px' }} aria-label="Navigate Back">
            <ChevronLeft aria-hidden="true" /> Back
          </button>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
          <h2 className="text-gradient">NeuroVenue Ops</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="btn" 
            style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid #f59e0b', transition: 'all 0.3s' }}
            onClick={useVenueStore.getState().simulateInfraction}
            aria-label="Simulate Security Fine"
          >
            <AlertTriangle size={16} aria-hidden="true" /> Simulate Fine
          </button>
          <button 
            className="btn" 
            style={{ 
              background: gateBStatus === 'clear' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)', 
              color: gateBStatus === 'clear' ? 'var(--accent-magenta)' : '#10b981', 
              border: `1px solid ${gateBStatus === 'clear' ? 'var(--accent-magenta)' : '#10b981'}`,
              transition: 'all 0.3s'
            }}
            onClick={handleSimulateCongestion}
            aria-label={gateBStatus === 'clear' ? "Simulate Gate Congestion" : "Resolve Gate Congestion"}
          >
            <AlertTriangle size={16} aria-hidden="true" /> 
            {gateBStatus === 'clear' ? 'Simulate Congestion' : 'Resolve Congestion'}
          </button>
          <div className="glass-card flex-center" style={{ padding: '0.5rem 1rem', gap: '8px', minWidth: '130px' }} aria-label={`Capacity is ${capacityPct}%`} role="status">
            <Users size={18} className="text-secondary" aria-hidden="true" />
            <span style={{ fontWeight: 'bold' }}>Capacity: {capacityPct}%</span>
          </div>
          <button className="btn btn-primary" onClick={() => setShowSettings(!showSettings)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)' }} aria-label="Toggle Global Settings">
            <Settings size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="grid-cols-3" style={{ gap: '1rem' }}>
             <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
               <div>
                 <span className="subtitle" style={{ fontSize: '0.8rem' }}>Total Attendees</span>
                 <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>64,219</h3>
                 <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>Live tracked</span>
               </div>
               <div style={{ marginTop: '0.5rem', alignSelf: 'flex-end' }}>
                 <MiniSparkline value={capacityPct} color="var(--accent-cyan)" />
               </div>
             </div>
             <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
               <div>
                 <span className="subtitle" style={{ fontSize: '0.8rem' }}>Est. Avg Wait Time</span>
                 <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', transition: 'color 0.3s', color: estWaitTime > 5.0 ? 'var(--accent-magenta)' : 'white' }}>{estWaitTime} min</h3>
                 <span style={{ color: estWaitTime <= 5.0 ? 'var(--primary)' : 'var(--accent-magenta)', fontSize: '0.8rem' }}>
                   {estWaitTime <= 5.0 ? 'Optimal Flow' : 'Elevated'}
                 </span>
               </div>
               <div style={{ marginTop: '0.5rem', alignSelf: 'flex-end' }}>
                 <MiniSparkline value={estWaitTime} color={estWaitTime <= 5.0 ? '#10b981' : '#ec4899'} />
               </div>
             </div>
             <div className="glass-card" style={{ padding: '1rem' }}>
               <span className="subtitle" style={{ fontSize: '0.8rem' }}>Eco Metrics (Offset & E-Waste)</span>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                 <div>
                   <h3 style={{ fontSize: '1.5rem', color: '#10b981' }}>{carbonOffset} t</h3>
                   <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>CO2 Eliminated</span>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-cyan)' }}>{Math.floor(useVenueStore.getState().eWasteCollected)} kg</h3>
                   <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>E-Waste Recycled</span>
                 </div>
               </div>
             </div>
          </div>
          
          <div style={{ flex: 1, minHeight: '500px' }} className="animate-slide-up">
            <CrowdHeatmap />
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-slide-up">
          <div style={{ flex: 1 }}>
            <AIAutopilot />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
