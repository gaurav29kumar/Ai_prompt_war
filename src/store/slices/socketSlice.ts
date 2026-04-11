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
    
    // Hardcoded logic here uses the mock JWT token for testing
    // in the real implementation this comes from Login context
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6Ik9SR0FOSVpFUiIsImlhdCI6MTc3NTkyODM5MSwiZXhwIjoxNzc2MDE0NzkxfQ.GbyM2xSuvvg6dpSHwmqhjSG2fbVE6jJvxQ6ZDttT0Mc";

    const socket = io('http://localhost:3001', {
      auth: {
         token: mockToken
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
