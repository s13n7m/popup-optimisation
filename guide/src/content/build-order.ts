export interface BuildPhase {
  id: string; name: string; stages: string; color: string; stageIds: string[]; done: string;
  /** Count only thread-tagged cards (Card.ui) or only the rest, for phases that split one stage. */
  only?: 'thread' | 'rest';
  /** Ongoing phases show no progress bar. */
  ongoing?: boolean;
}

export const buildOrder: BuildPhase[] = [
  { id: 'p0', name: 'Infrastructure', stages: 'Stage 0', color: '#dee2e6', stageIds: ['infrastructure'], done: 'make test passes, Vercel shows a preview of guide/, progress syncs through Supabase, and all API keys are in a local .env.' },
  { id: 'p1', name: 'Foundations', stages: 'Stages 1 and 2', color: '#ffec99', stageIds: ['frame-and-scope', 'build-the-data'], done: 'make data builds real EMEA venues with area statistics and prints 1 to 6 completions per vehicle-day for every market.' },
  { id: 'p2', name: 'Predict', stages: 'Stages 3 to 5', color: '#d0bfff', stageIds: ['train-the-model', 'validate-and-register', 'score-nightly'], done: 'The model beats a naive mean on the last 4 weeks and predictions.parquet is written with drivers and confidence.' },
  { id: 'p3', name: 'Decide and serve', stages: 'Stage 6, back end', color: '#a5d8ff', stageIds: ['decide-and-serve'], only: 'rest', done: 'The MIP plan respects budget and fleet, matches or beats greedy, and POST /replan/{market} answers in seconds at 300 venues.' },
  { id: 'p4', name: 'Planner UI', stages: 'Stage 6, front end', color: '#99e9f2', stageIds: ['decide-and-serve'], only: 'thread', done: 'A planner opens the Vercel URL, sees a plan, excludes a venue, re-plans and reads why in plain language.' },
  { id: 'p5', name: 'Operate', stages: 'Stages 7 and 8', color: '#ffc9c9', stageIds: ['monitor', 'retrain-and-promote'], done: 'Injected drift is caught by residuals, the retrain trigger fires, and a challenger is judged on explore rows.' },
  { id: 'p6', name: 'Scale and explain', stages: 'All stages', color: '#b2f2bb', stageIds: [], ongoing: true, done: '3,400 venues timed both ways, a one-page diagram drawn, and all 9 talking points answerable.' },
];
