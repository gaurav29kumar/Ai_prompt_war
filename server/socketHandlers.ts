import { Server, Socket } from 'socket.io';
import * as schemas from './schemas.js';
import { eWasteStore } from './DataStructures/EWasteStore.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerSocketHandlers = (io: Server, socket: Socket, venueState: any) => {
  console.log(`Backend: Client connected -> ${socket.id} with ROLE: ${socket.data.user?.role}`);
  socket.emit('stateSync', venueState);

  socket.on('dispatchAction', (action) => {
    try {
      console.log(`Received action: ${action.type}`);
      // Enforce RBAC: Standard users shouldn't create congestion
      const userRole = socket.data.user?.role;
      const isOrganizer = userRole === 'ORGANIZER';

      switch(action.type) {
        case 'SIMULATE_CONGESTION': {
          if (!isOrganizer) throw new Error('Unauthorized');
          const payload = schemas.CongestionPayloadSchema.parse(action.payload);
          venueState.gateBStatus = payload.gateBStatus;
          venueState.congestionLevel = payload.congestionLevel;
          venueState.estWaitTime += 1.5;
          venueState.capacityPct += 5;
          if (payload.alert) venueState.alerts.unshift({ ...payload.alert, id: Date.now() });
          if (venueState.alerts.length > 50) venueState.alerts.length = 50;
          break;
        }
        
        case 'RESOLVE_CONGESTION': {
          if (!isOrganizer) throw new Error('Unauthorized');
          const payload = schemas.ResolveCongestionPayloadSchema.parse(action.payload);
          venueState.gateBStatus = 'clear';
          venueState.congestionLevel = 'low';
          venueState.estWaitTime = Math.max(1.0, venueState.estWaitTime - 1.5);
          if (payload.alert) venueState.alerts.unshift({ ...payload.alert, id: Date.now() });
          if (venueState.alerts.length > 50) venueState.alerts.length = 50;
          break;
        }

        case 'UPDATE_QUEUE': {
          const payload = schemas.QueueStatusPayloadSchema.parse(action.payload);
          venueState.virtualQueueStatus = payload.status;
          break;
        }

        case 'UPDATE_SETTING': {
          if (!isOrganizer) throw new Error('Unauthorized');
          const payload = schemas.SettingsPayloadSchema.parse(action.payload);
          // dynamically update the venue state using type-safe casting
          venueState[payload.setting] = payload.value;
          break;
        }

        case 'REPORT_EWASTE': {
          const payload = schemas.EWastePayloadSchema.parse(action.payload);
          eWasteStore.addRecord(socket.id, payload.amount);
          venueState.eWasteCollected = eWasteStore.getTotal();
          venueState.alerts.unshift({
            id: Date.now(),
            type: 'sentiment',
            message: `Eco-Reward Claimed: Attendee recycled ${payload.amount}kg of e-waste.`,
            time: 'Just now',
            autoAction: true
          });
          if (venueState.alerts.length > 50) venueState.alerts.length = 50;
          break;
        }

        case 'ISSUE_FINE': {
          if (!isOrganizer) throw new Error('Unauthorized');
          const payload = schemas.InfractionPayloadSchema.parse(action.payload);
          venueState.infractions.unshift({ ...payload.infraction, id: Date.now() });
          venueState.alerts.unshift({
            id: Date.now()+1,
            type: 'congestion',
            message: `AI Drone detached to intercept ${payload.infraction.type} at ${payload.infraction.location}. Fine issued.`,
            time: 'Just now',
            autoAction: true
          });
          if (venueState.infractions.length > 50) venueState.infractions.length = 50;
          if (venueState.alerts.length > 50) venueState.alerts.length = 50;
          break;
        }
      }
      io.emit('stateSync', venueState);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      console.error('Validation or Authorization Error:', error.errors || error.message);
      // Deny and disconnect if malicious
      socket.emit('error', error.errors || 'Action unauthorized or malformed');
    }
  });

  socket.on('disconnect', () => {
    console.log(`Backend: Client disconnected -> ${socket.id}`);
  });
};
