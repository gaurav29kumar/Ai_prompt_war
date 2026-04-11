import type { StateCreator } from 'zustand';

export interface GateFlow {
  name: string;
  flow: number;
}

export interface VenueSlice {
  capacityPct: number;
  estWaitTime: number;
  carbonOffset: number;
  eWasteCollected: number;
  congestionLevel: 'low' | 'medium' | 'high';
  gateBStatus: 'clear' | 'congested';
  virtualQueueStatus: 'idle' | 'joined' | 'ready';
  gateThroughput: GateFlow[];
  arNavigationActive: boolean;
  aiReroutingActive: boolean;
  dynamicPricingActive: boolean;
  arBetaActive: boolean;

  toggleSetting: (setting: 'aiReroutingActive' | 'dynamicPricingActive' | 'arBetaActive', value: boolean) => void;
  setVirtualQueueStatus: (status: 'idle' | 'joined' | 'ready') => void;
  setArNavigationActive: (active: boolean) => void;
  simulateCongestion: () => void;
  resolveCongestion: () => void;
  reportEWaste: (amount: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createVenueSlice: StateCreator<any, [], [], VenueSlice> = (set, get) => ({
  capacityPct: 84,
  estWaitTime: 4.2,
  carbonOffset: 14.5,
  eWasteCollected: 0,
  congestionLevel: 'low',
  gateBStatus: 'clear',
  virtualQueueStatus: 'idle',
  gateThroughput: [],
  arNavigationActive: false,
  aiReroutingActive: true,
  dynamicPricingActive: true,
  arBetaActive: true,

  toggleSetting: (setting, value) => {
    const socket = get().socket;
    if (socket) socket.emit('dispatchAction', { type: 'UPDATE_SETTING', payload: { setting, value } });
  },

  setVirtualQueueStatus: (status) => {
    const socket = get().socket;
    if (socket) socket.emit('dispatchAction', { type: 'UPDATE_QUEUE', payload: { status } });
  },

  setArNavigationActive: (active) => set({ arNavigationActive: active }),

  reportEWaste: (amount) => {
    const socket = get().socket;
    if (socket) socket.emit('dispatchAction', { type: 'REPORT_EWASTE', payload: { amount } });
  },

  simulateCongestion: () => {
    const socket = get().socket;
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
    const socket = get().socket;
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
});
