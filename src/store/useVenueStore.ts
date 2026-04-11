import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface Alert {
  id: number;
  type: 'congestion' | 'supply' | 'sentiment';
  message: string;
  autoAction: boolean;
  time: string;
}

export interface Infraction {
  id: number;
  type: string;
  location: string;
  status: string;
  time: string;
  evidence: string;
}

export interface GateFlow {
  name: string;
  flow: number;
}

export interface VenueState {
  capacityPct: number;
  estWaitTime: number;
  carbonOffset: number;
  eWasteCollected: number;
  congestionLevel: 'low' | 'medium' | 'high';
  gateBStatus: 'clear' | 'congested';
  alerts: Alert[];
  infractions: Infraction[];
  virtualQueueStatus: 'idle' | 'joined' | 'ready';
  gateThroughput: GateFlow[];
  arNavigationActive: boolean;
  
  socket: Socket | null;
  initSocket: () => void;

  setVirtualQueueStatus: (status: 'idle' | 'joined' | 'ready') => void;
  setArNavigationActive: (active: boolean) => void;
  simulateCongestion: () => void;
  resolveCongestion: () => void;
  reportEWaste: (amount: number) => void;
  simulateInfraction: () => void;
}

export const useVenueStore = create<VenueState>((set, get) => ({
  capacityPct: 84,
  estWaitTime: 4.2,
  carbonOffset: 14.5,
  eWasteCollected: 0,
  congestionLevel: 'low',
  gateBStatus: 'clear',
  alerts: [],
  infractions: [],
  virtualQueueStatus: 'idle',
  gateThroughput: [],
  arNavigationActive: false,
  socket: null,

  initSocket: () => {
    if (get().socket) return; 
    
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('Frontend connected to venue backend.');
    });

    socket.on('stateSync', (newState: any) => {
      set({ 
        capacityPct: newState.capacityPct,
        estWaitTime: newState.estWaitTime,
        carbonOffset: newState.carbonOffset,
        eWasteCollected: newState.eWasteCollected,
        congestionLevel: newState.congestionLevel,
        gateBStatus: newState.gateBStatus,
        alerts: newState.alerts,
        infractions: newState.infractions || [],
        virtualQueueStatus: newState.virtualQueueStatus,
        gateThroughput: newState.gateThroughput || []
      });
    });

    set({ socket });
  },
  
  setVirtualQueueStatus: (status) => {
    const { socket } = get();
    if (socket) {
      socket.emit('dispatchAction', { type: 'UPDATE_QUEUE', payload: { status } });
    }
  },

  setArNavigationActive: (active) => set({ arNavigationActive: active }),

  reportEWaste: (amount) => {
    const { socket } = get();
    if (socket) {
      socket.emit('dispatchAction', { type: 'REPORT_EWASTE', payload: { amount } });
    }
  },

  simulateInfraction: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('dispatchAction', {
        type: 'ISSUE_FINE',
        payload: {
          infraction: {
            type: 'Illegal Parking Blockade',
            location: 'Gate A Exterior',
            status: 'fine_issued',
            time: 'Just now',
            evidence: 'Autonomous Drone #4'
          }
        }
      });
    }
  },

  simulateCongestion: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('dispatchAction', {
        type: 'SIMULATE_CONGESTION',
        payload: {
          gateBStatus: 'congested',
          congestionLevel: 'medium',
          alert: {
            type: 'congestion',
            message: 'Sudden crowd surge at Gate B! Redirecting automated flow paths to Gate A.',
            time: 'Just now',
            autoAction: true
          }
        }
      });
    }
  },

  resolveCongestion: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('dispatchAction', {
        type: 'RESOLVE_CONGESTION',
        payload: {
          alert: {
            type: 'sentiment',
            message: 'Gate B congestion resolved. Normal routing resumed.',
            time: 'Just now',
            autoAction: false
          }
        }
      });
    }
  }
}));
