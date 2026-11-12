import type { Card, Stage } from '../types';
import { stage0 } from './stage-0-setup';
import { stage1 } from './stage-1-data';

// Add one file per stage and list it here, in order.
export const stages: Stage[] = [stage0, stage1];
export const allCards: Card[] = stages.flatMap((s) => s.cards);
export { buildOrder } from './build-order';
export { dataSources, venueColumns } from './data-sources';
