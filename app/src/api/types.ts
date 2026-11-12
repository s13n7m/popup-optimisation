// The contract between this app and the FastAPI service (step 6).
// Keep it in plain language fields: planners never see model jargon.

export type Confidence = 'high' | 'medium' | 'low';

export interface Driver {
  label: string; // "Busy area", "Far from a store"
  effect: 'up' | 'down';
}

export interface VenuePick {
  venueId: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  cars: number;
  expectedCompletions: number; // per week
  weeklyCost: number;
  reason: 'exploit' | 'explore';
  confidence: Confidence;
  drivers: Driver[];
}

export interface Plan {
  market: string;
  week: string; // ISO date of the Monday
  picks: VenuePick[];
  totalExpectedCompletions: number;
  totalCost: number;
  budget: number;
  fleet: number;
  solveSeconds: number;
  usedFallback: boolean;
  dataAsOf: string; // when the nightly predictions were made
}

export interface Constraints {
  excludedVenueIds: string[];
  budget?: number;
  fleet?: number;
}
