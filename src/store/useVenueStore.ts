import { create } from 'zustand';
import type { VenueSlice } from './slices/venueSlice';
import { createVenueSlice } from './slices/venueSlice';
import type { AlertSlice } from './slices/alertSlice';
import { createAlertSlice } from './slices/alertSlice';
import type { SocketSlice } from './slices/socketSlice';
import { createSocketSlice } from './slices/socketSlice';

export type VenueStateStore = VenueSlice & AlertSlice & SocketSlice;

export const useVenueStore = create<VenueStateStore>()((...a) => ({
  ...createVenueSlice(...a),
  ...createAlertSlice(...a),
  ...createSocketSlice(...a)
}));
