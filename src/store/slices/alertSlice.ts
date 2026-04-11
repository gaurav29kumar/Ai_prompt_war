import type { StateCreator } from 'zustand';

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

export interface AlertSlice {
  alerts: Alert[];
  infractions: Infraction[];
  simulateInfraction: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createAlertSlice: StateCreator<any, [], [], AlertSlice> = (_, get) => ({
  alerts: [],
  infractions: [],

  simulateInfraction: () => {
    const socket = get().socket;
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
  }
});
