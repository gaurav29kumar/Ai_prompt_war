import type { StateCreator } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface SocketSlice {
  socket: Socket | null;
  initSocket: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createSocketSlice: StateCreator<any, [], [], SocketSlice> = (set, get) => ({
  socket: null,

  initSocket: () => {
    if (get().socket) return; 
    
    // Abstracted Authentication layer logic
    // Resolving mock JWT token securely through Vite environmental pipelines
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const socket = io(backendUrl, {
      auth: {
         token: import.meta.env.VITE_MOCK_JWT
      }
    });

    socket.on('connect', () => {
      console.log('Frontend connected to venue backend.');
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        gateThroughput: newState.gateThroughput || [],
        aiReroutingActive: newState.aiReroutingActive ?? true,
        dynamicPricingActive: newState.dynamicPricingActive ?? true,
        arBetaActive: newState.arBetaActive ?? true
      });
    });

    socket.on('error', (err) => {
      console.error("Socket error via server:", err);
    });

    set({ socket });
  }
});
