export interface BuildPhase {
  id: string; name: string; stages: string; color: string; stageIds: string[]; done: string;
  /** Count only thread-tagged cards (Card.ui) or only the rest, for phases that split one stage. */
  only?: 'thread' | 'rest';
  /** Ongoing phases show no progress bar. */
  ongoing?: boolean;
}

export const buildOrder: BuildPhase[] = [
  { id: 'p0', name: 'Set up', stages: 'Stage 0', color: '#dee2e6', stageIds: ['setup'], done: 'A pushed branch shows a working preview URL.' },
  { id: 'p1', name: 'Foundations', stages: 'Stage 1', color: '#ffec99', stageIds: ['data'], done: 'The data builds and passes its checks.' },
  { id: 'p2', name: 'Ship and explain', stages: 'All stages', color: '#b2f2bb', stageIds: [], ongoing: true, done: 'Everything runs end to end and you can explain it.' },
];
