export let venueState = {
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
  ],
  aiReroutingActive: true,
  dynamicPricingActive: true,
  arBetaActive: true
};

export const updateVenueState = (updates: Partial<typeof venueState>) => {
  venueState = { ...venueState, ...updates };
};
