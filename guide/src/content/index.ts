import type { Card, Stage } from '../types';
import { stage0 } from './stage-0-infrastructure';
import { stage1 } from './stage-1-frame-and-scope';
import { stage2 } from './stage-2-build-the-data';
import { stage3 } from './stage-3-train-the-model';
import { stage4 } from './stage-4-validate-and-register';
import { stage5 } from './stage-5-score-nightly';
import { stage6 } from './stage-6-decide-and-serve';
import { stage7 } from './stage-7-monitor';
import { stage8 } from './stage-8-retrain-and-promote';

export const stages: Stage[] = [stage0, stage1, stage2, stage3, stage4, stage5, stage6, stage7, stage8];
export const allCards: Card[] = stages.flatMap((s) => s.cards);
export { buildOrder } from './build-order';
export { dataSources, venueColumns } from './data-sources';
