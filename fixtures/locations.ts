import type { Coordinates } from '../screens/GeoLocationScreen.ts';

/** Fixed places for mocked GPS positions. */
export const LOCATIONS = {
  amsterdam: { latitude: 52.3676, longitude: 4.9041 },
  saoPaulo: { latitude: -23.5505, longitude: -46.6333 },
} as const satisfies Record<string, Coordinates>;
