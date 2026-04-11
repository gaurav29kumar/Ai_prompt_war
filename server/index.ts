import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let venueState = {
  capacityPct: 84,
  estWaitTime: 4.2,
  carbonOffset: 14.5,
  eWasteCollected: 342.5, // kg
  congestionLevel: 'low',
  gateBStatus: 'clear',
  alerts: [
    {
      id: 1,
      type: 'congestion',
      message: 'Monitoring crowd density across all gates.',
      time: 'Just now',
      autoAction: true
    }
  ],
  infractions: [
    {
      id: 101,
      type: 'littering',
      location: 'Concourse A',
      status: 'pending_fine',
      time: '5 mins ago',
      evidence: 'Drone Footage'
    }
  ],
  virtualQueueStatus: 'idle',
  gateThroughput: [
    { name: 'Gate A', flow: 120 },
    { name: 'Gate B', flow: 85 },
    { name: 'Gate C', flow: 210 }
  ]
};

// Simulate live stadium data
setInterval(() => {
  venueState.capacityPct = Math.max(50, Math.min(100, venueState.capacityPct + (Math.random() > 0.5 ? 1 : -1)));
  
  const waitChange = (Math.random() * 0.4) - 0.2;
  venueState.estWaitTime = Math.max(1.0, parseFloat((venueState.estWaitTime + waitChange).toFixed(1)));
  
  venueState.gateThroughput = venueState.gateThroughput.map(gate => {
    let baseFlow = gate.name === 'Gate B' && venueState.gateBStatus === 'congested' ? 400 : 150;
    return { ...gate, flow: Math.floor(baseFlow + (Math.random() * 50 - 25)) };
  });

  io.emit('stateSync', venueState);
}, 3000);

io.on('connection', (socket) => {
  console.log(`Backend: Client connected -> ${socket.id}`);
  socket.emit('stateSync', venueState);

  socket.on('dispatchAction', (action) => {
    console.log(`Received action: ${action.type}`);

    switch(action.type) {
      case 'SIMULATE_CONGESTION':
        venueState.gateBStatus = action.payload.gateBStatus;
        venueState.congestionLevel = action.payload.congestionLevel;
        venueState.estWaitTime += 1.5;
        venueState.capacityPct += 5;
        if (action.payload.alert) venueState.alerts.unshift({ ...action.payload.alert, id: Date.now() });
        break;
      
      case 'RESOLVE_CONGESTION':
        venueState.gateBStatus = 'clear';
        venueState.congestionLevel = 'low';
        venueState.estWaitTime = Math.max(1.0, venueState.estWaitTime - 1.5);
        if (action.payload.alert) venueState.alerts.unshift({ ...action.payload.alert, id: Date.now() });
        break;

      case 'UPDATE_QUEUE':
        venueState.virtualQueueStatus = action.payload.status;
        break;

      case 'REPORT_EWASTE':
        venueState.eWasteCollected += action.payload.amount;
        venueState.alerts.unshift({
          id: Date.now(),
          type: 'sentiment',
          message: `Eco-Reward Claimed: Attendee recycled ${action.payload.amount}kg of e-waste.`,
          time: 'Just now',
          autoAction: true
        });
        break;

      case 'ISSUE_FINE':
        venueState.infractions.unshift({ ...action.payload.infraction, id: Date.now() });
        venueState.alerts.unshift({
          id: Date.now()+1,
          type: 'congestion',
          message: `AI Drone detached to intercept ${action.payload.infraction.type} at ${action.payload.infraction.location}. Fine issued.`,
          time: 'Just now',
          autoAction: true
        });
        break;
    }
    io.emit('stateSync', venueState);
  });

  socket.on('disconnect', () => {
    console.log(`Backend: Client disconnected -> ${socket.id}`);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`NeuroVenue Real-time Backend running on http://localhost:${PORT}`);
});
