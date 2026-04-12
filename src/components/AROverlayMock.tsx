import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Zap, AlertTriangle, X } from 'lucide-react';
import { useVenueStore } from '../store/useVenueStore';

const AROverlayMock = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const gateBStatus = useVenueStore(state => state.gateBStatus);
  const arNavigationActive = useVenueStore(state => state.arNavigationActive);
  const setArNavigationActive = useVenueStore(state => state.setArNavigationActive);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isActive = true; // GC Memory constraint flag
    const currentVideoRef = videoRef.current;
    
    const startCamera = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        stream = media;
        if (!isActive) {
           media.getTracks().forEach(track => track.stop());
           return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = media;
          await videoRef.current.play();
          setHasCamera(true);
        }
      } catch (err) {
        if (!isActive) return;
        console.warn("Camera access fallback.", err);
        setHasCamera(false);
      }
    };

    startCamera();

    return () => {
      isActive = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (currentVideoRef) {
        currentVideoRef.srcObject = null;
      }
    };
  }, [arNavigationActive]);

  const arGlassStyle: React.CSSProperties = arNavigationActive ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    background: 'rgba(10, 11, 16, 0.95)',
    display: 'flex',
    flexDirection: 'column'
  } : {
    padding: '1rem', 
    marginTop: '1rem', 
    background: 'rgba(20, 24, 39, 0.8)', 
    border: '1px solid var(--primary-glow)', 
    position: 'relative', 
    overflow: 'hidden',
    borderRadius: 'var(--radius-md)'
  };

  const arContent = (
    <div className={arNavigationActive ? 'animate-slide-up' : 'glass-card flex-center'} style={arGlassStyle}>
      
      {/* Background simulated or real camera feed */}
      {hasCamera === true && (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: arNavigationActive ? 1 : 0.8 }} 
        />
      )}
      {hasCamera === false && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.3, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)' }}></div>
      )}

      {/* AR Content Layer */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: arNavigationActive ? '2rem' : '0' }}>
        
        {/* Header Ribbon */}
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
           <span style={{ fontSize: arNavigationActive ? '1rem' : '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '16px' }}>
             <Camera size={arNavigationActive ? 18 : 14} color={hasCamera ? '#10b981' : 'var(--text-secondary)'} /> AR Mode {hasCamera === true ? '(Live)' : '(Simulated)'}
           </span>
           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <span className="animate-pulse-glow" style={{ fontSize: arNavigationActive ? '1rem' : '0.8rem', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '16px', fontWeight: 'bold' }}>Live Stats</span>
             {arNavigationActive && (
               <button className="btn btn-secondary" onClick={() => setArNavigationActive(false)} style={{ padding: '8px', borderRadius: '50%' }}>
                 <X size={20} />
               </button>
             )}
           </div>
        </div>

        {/* Viewfinder Area */}
        <div style={{ flex: 1, position: 'relative', border: arNavigationActive ? 'none' : '1px dashed rgba(255, 255, 255, 0.2)', borderRadius: 'var(--radius-sm)', minHeight: arNavigationActive ? 'auto' : '300px' }}>
          
          {hasCamera === false && (
             <div style={{ position: 'absolute', top: '40%', left: '0', width: '100%', textAlign: 'center' }}>
               <p style={{ fontSize: arNavigationActive ? '1.2rem' : '0.8rem', color: 'var(--text-muted)' }}>Camera access unavailable.<br/>Showing AR layout only.</p>
             </div>
          )}

          {/* Contextual Warning based on State */}
          {gateBStatus === 'congested' && (
            <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate3d(-50%, 0, 0)', willChange: 'transform', background: 'rgba(0,0,0,0.8)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--accent-magenta)', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.3s ease', textAlign: 'center', width: arNavigationActive ? '300px' : '90%' }}>
               <AlertTriangle size={32} color="var(--accent-magenta)" className="animate-pulse-glow" style={{ marginBottom: '0.5rem' }} />
               <span style={{ color: 'white', fontWeight: 'bold', fontSize: arNavigationActive ? '1.2rem' : '1rem' }}>Reroute Required</span>
               <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Gate B is congested ahead. Turning left towards Gate A.</span>
            </div>
          )}

          {/* Mock Floating AR Nav Line - Hardware Accelerated Transform */}
          {arNavigationActive && (
            <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translate3d(-50%, 0, 0)', willChange: 'transform', width: '200px', height: '40vh', borderLeft: '4px dashed var(--primary)', borderBottom: '4px dashed var(--primary)', borderRadius: '0 0 0 40px', opacity: 0.6, animation: 'fadeIn 1s ease' }}>
               <div style={{ position: 'absolute', top: '-10px', left: '-12px', width: '20px', height: '20px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 15px var(--primary-glow)' }} />
            </div>
          )}

          {/* Mock Floating AR Tag - Contextual data */}
          <div className="animate-pulse-glow" style={{ position: 'absolute', top: arNavigationActive ? '40%' : '20%', left: '10%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-cyan)', width: arNavigationActive ? '180px' : '120px' }}>
            <p style={{ fontSize: arNavigationActive ? '0.9rem' : '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Player 7</p>
            <div className="flex-between">
              <span style={{ fontSize: arNavigationActive ? '1.1rem' : '0.8rem', fontWeight: 'bold', color: 'white' }}>Speed</span>
              <span style={{ fontSize: arNavigationActive ? '1.2rem' : '0.9rem', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>32km/h</span>
            </div>
            <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--accent-cyan) 70%, transparent 70%)', marginTop: '8px' }} />
          </div>

          <div style={{ position: 'absolute', bottom: '15%', right: '10%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Zap size={16} color="var(--primary)" />
             <span style={{ fontSize: arNavigationActive ? '1rem' : '0.7rem', color: 'white' }}>Restroom 2 min away</span>
          </div>
          
          {/* Viewfinder brackets */}
          {!arNavigationActive && (
            <>
              <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid white', borderLeft: '2px solid white' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderTop: '2px solid white', borderRight: '2px solid white' }} />
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px', borderBottom: '2px solid white', borderLeft: '2px solid white' }} />
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '2px solid white', borderRight: '2px solid white' }} />
            </>
          )}
        </div>
      </div>
    </div>
  );

  return arNavigationActive ? createPortal(arContent, document.body) : arContent;
};

export default AROverlayMock;
