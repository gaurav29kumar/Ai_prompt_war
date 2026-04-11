import { Map, Activity, ShieldAlert } from 'lucide-react';
import { useVenueStore } from '../store/useVenueStore';

const CrowdHeatmap = () => {
  const { gateBStatus, gateThroughput } = useVenueStore();

  // Helper to get live flow for a gate else fallback to 100
  const getFlow = (name: string) => gateThroughput.find(g => g.name === name)?.flow || 100;
  
  const gateAFlow = getFlow('Gate A');
  const gateBFlow = getFlow('Gate B');
  const gateCFlow = getFlow('Gate C');

  // Animation speed is inversely proportional to flow (higher flow = faster speed)
  // Base duration is around 4s for normal flow (100)
  const getSpeed = (flow: number) => Math.max(0.5, 400 / flow);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Map className="text-secondary" /> Live Stadium Heatmap
        </h3>
        <span style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '4px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} className="animate-pulse-glow" /> 
          Sensors Active
        </span>
      </div>
      
      <div style={{ flex: 1, position: 'relative', background: 'rgba(10, 11, 16, 0.7)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', minHeight: '350px' }}>
        
        {/* Core SVG Structure */}
        <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
             {/* Radial Gradients for Zone Heat */}
             <radialGradient id="heatNormal" cx="50%" cy="50%" r="50%">
               <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
               <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
             </radialGradient>
             <radialGradient id="heatHeavy" cx="50%" cy="50%" r="50%">
               <stop offset="0%" stopColor="rgba(236, 72, 153, 0.8)" />
               <stop offset="100%" stopColor="rgba(236, 72, 153, 0)" />
             </radialGradient>
          </defs>

          {/* Grid Background */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Stadium Perimeter Outline */}
          <ellipse cx="400" cy="250" rx="300" ry="180" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="4" />
          <ellipse cx="400" cy="250" rx="280" ry="160" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          
          {/* Field */}
          <rect x="250" y="150" width="300" height="200" rx="20" fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="2" />
          <line x1="400" y1="150" x2="400" y2="350" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="2" />
          <circle cx="400" cy="250" r="40" fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="2" />

          {/* Gate Nodes */}
          {/* Gate A - North West */}
          <circle cx="150" cy="120" r="15" fill="#1e293b" stroke="var(--primary)" strokeWidth="2" />
          <text x="150" y="125" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">A</text>
          <text x="150" y="90" fill="var(--text-secondary)" fontSize="12" textAnchor="middle">{gateAFlow} ppm</text>
          <circle cx="150" cy="120" r={30 + (gateAFlow/10)} fill="url(#heatNormal)" />

          {/* Gate B - North East (Congestion Toggle Point) */}
          <circle cx="650" cy="120" r="15" fill="#1e293b" stroke={gateBStatus === 'congested' ? 'var(--accent-magenta)' : 'var(--primary)'} strokeWidth="2" />
          <text x="650" y="125" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">B</text>
          <text x="650" y="90" fill={gateBStatus === 'congested' ? 'var(--accent-magenta)' : 'var(--text-secondary)'} fontSize="12" textAnchor="middle">{gateBFlow} ppm</text>
          <circle cx="650" cy="120" r={30 + (gateBFlow/5)} fill={gateBStatus === 'congested' ? 'url(#heatHeavy)' : 'url(#heatNormal)'}>
             {gateBStatus === 'congested' && <animate attributeName="r" values="60;100;60" dur="2s" repeatCount="indefinite" />}
          </circle>

          {/* Gate C - South */}
          <circle cx="400" cy="450" r="15" fill="#1e293b" stroke="var(--primary)" strokeWidth="2" />
          <text x="400" y="455" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">C</text>
          <text x="400" y="480" fill="var(--text-secondary)" fontSize="12" textAnchor="middle">{gateCFlow} ppm</text>
          <circle cx="400" cy="450" r={30 + (gateCFlow/10)} fill="url(#heatNormal)" />

          {/* Dynamic Flow Paths (Crowds entering from gates into seating zones) */}
          
          {/* Path from Gate A into West Seating */}
          <path d="M 150,120 Q 150,250 220,250" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="15" strokeLinecap="round" />
          <path d="M 150,120 Q 150,250 220,250" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,15">
            <animate attributeName="stroke-dashoffset" from="1000" to="0" dur={`${getSpeed(gateAFlow)}s`} repeatCount="indefinite" />
          </path>

          {/* Path from Gate C into South Seating */}
          <path d="M 400,450 Q 400,380 400,380" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="15" strokeLinecap="round" />
          <path d="M 400,450 Q 400,380 400,380" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,15">
            <animate attributeName="stroke-dashoffset" from="1000" to="0" dur={`${getSpeed(gateCFlow)}s`} repeatCount="indefinite" />
          </path>

          {/* Dynamic Path from Gate B - Routes change on Congestion */}
          {gateBStatus === 'congested' ? (
            <>
              {/* Blocked Path (Red, Static) */}
              <path d="M 650,120 Q 650,250 580,250" fill="none" stroke="rgba(236, 72, 153, 0.6)" strokeWidth="15" strokeDasharray="10,10" strokeLinecap="round" />
              
              {/* Reroute Path to Gate A (Blue, Fast) */}
              <path d="M 650,120 Q 400,30 150,120" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="6" strokeLinecap="round" />
              <path d="M 650,120 Q 400,30 150,120" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,15">
                <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="2s" repeatCount="indefinite" />
              </path>
            </>
          ) : (
            <>
              {/* Normal Path into East Seating */}
              <path d="M 650,120 Q 650,250 580,250" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="15" strokeLinecap="round" />
              <path d="M 650,120 Q 650,250 580,250" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,15">
                <animate attributeName="stroke-dashoffset" from="1000" to="0" dur={`${getSpeed(gateBFlow)}s`} repeatCount="indefinite" />
              </path>
            </>
          )}

        </svg>

        {/* Floating UI Elements on top of SVG map */}
        {gateBStatus === 'congested' && (
          <div style={{ position: 'absolute', top: '25%', right: '15%', background: 'rgba(0,0,0,0.8)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-magenta)', display: 'flex', alignItems: 'center', gap: '8px', animation: 'fadeIn 0.3s ease' }}>
            <ShieldAlert size={14} color="var(--accent-magenta)" className="animate-pulse-glow" />
            <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>Congestion Block</span>
          </div>
        )}

        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex', gap: '0.75rem', background: 'rgba(0,0,0,0.8)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}><span style={{ width: '8px', height: '8px', background: 'rgba(59, 130, 246, 0.8)', borderRadius: '50%' }}></span> Optimal Flow</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}><span style={{ width: '8px', height: '8px', background: 'rgba(16, 185, 129, 0.8)', borderRadius: '50%' }}></span> Reroute Active</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}><span style={{ width: '8px', height: '8px', background: 'rgba(236, 72, 153, 0.8)', borderRadius: '50%' }}></span> Bottleneck</div>
        </div>
      </div>
    </div>
  );
};

export default CrowdHeatmap;
