import type { Constraints, Plan, VenuePick } from './types';

// Mock data so the screens can be built before the backend exists.
// Replace with real responses once POST /replan/{market} is live.
const VENUES: VenuePick[] = [
  { venueId: 'v1', name: 'Riverside Shopping Centre', area: 'Central', lat: 51.5, lng: -0.12, cars: 3, expectedCompletions: 41, weeklyCost: 9200, reason: 'exploit', confidence: 'high',
    drivers: [{ label: 'Very busy area', effect: 'up' }, { label: 'High local incomes', effect: 'up' }] },
  { venueId: 'v2', name: 'Northgate Retail Park', area: 'North', lat: 51.56, lng: -0.1, cars: 2, expectedCompletions: 24, weeklyCost: 6100, reason: 'exploit', confidence: 'medium',
    drivers: [{ label: 'Busy area', effect: 'up' }, { label: 'Far from nearest store', effect: 'down' }] },
  { venueId: 'v3', name: 'Harbour Marina Car Park', area: 'East', lat: 51.5, lng: -0.02, cars: 1, expectedCompletions: 9, weeklyCost: 2800, reason: 'explore', confidence: 'low',
    drivers: [{ label: 'Rarely tested before', effect: 'up' }] },
  { venueId: 'v4', name: 'Westfield Outlet', area: 'West', lat: 51.51, lng: -0.22, cars: 2, expectedCompletions: 27, weeklyCost: 7400, reason: 'exploit', confidence: 'high',
    drivers: [{ label: 'Local event this week', effect: 'up' }, { label: 'Close to a store', effect: 'up' }] },
];

export function mockPlan(market: string, c: Constraints = { excludedVenueIds: [] }): Plan {
  const picks = VENUES.filter((v) => !c.excludedVenueIds.includes(v.venueId));
  return {
    market,
    week: '2026-11-16',
    picks,
    totalExpectedCompletions: picks.reduce((s, p) => s + p.expectedCompletions, 0),
    totalCost: picks.reduce((s, p) => s + p.weeklyCost, 0),
    budget: c.budget ?? 30000,
    fleet: c.fleet ?? 10,
    solveSeconds: 1.8,
    usedFallback: false,
    dataAsOf: '2026-11-12T02:00:00Z',
  };
}
