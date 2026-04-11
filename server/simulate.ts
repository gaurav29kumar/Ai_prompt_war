import { Server } from 'socket.io';
import { venueState } from './state.js';

export const startSimulation = (io: Server) => {
  // Simulate live stadium data
  setInterval(() => {
    venueState.capacityPct = Math.max(50, Math.min(100, venueState.capacityPct + (Math.random() > 0.5 ? 1 : -1)));
    
    const waitChange = (Math.random() * 0.4) - 0.2;
    venueState.estWaitTime = Math.max(1.0, parseFloat((venueState.estWaitTime + waitChange).toFixed(1)));
    
    // Memory Complexity Optimization: Mutate objects in place instead of creating a new array 
    // and copies of objects every interval tick. GC Overhead drops to O(1).
    for (let i = 0; i < venueState.gateThroughput.length; i++) {
      const gate = venueState.gateThroughput[i];
      const baseFlow = gate.name === 'Gate B' && venueState.gateBStatus === 'congested' ? 400 : 150;
      gate.flow = Math.floor(baseFlow + (Math.random() * 50 - 25));
    }

    io.emit('stateSync', venueState);
  }, 3000);
};
