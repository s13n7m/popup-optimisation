export type Cadence = 'O' | 'N' | 'D' | 'M';
export type Phase = 'setup' | 'plan' | 'build' | 'ship' | 'run';

export interface Card {
  id: string;
  cadence: Cadence;
  text: string;
  steps: string[];
  done: string;
  /** Good practice the scaffold stubs do not list. */
  extra?: boolean;
  /** Part of the planner UI thread (the app/ folder). */
  ui?: boolean;
}

export interface Stage {
  id: string;
  num: number;
  phase: Phase;
  eyebrow: string;
  title: string;
  step: string;
  branch: string;
  out: string;
  summary: string;
  files: string[];
  cards: Card[];
}

export interface Flags { extra?: boolean; ui?: boolean }

export const card = (id: string, cadence: Cadence, text: string, steps: string[], done: string, flags: Flags = {}): Card =>
  ({ id, cadence, text, steps, done, ...flags });

export const CADENCE: Record<Cadence, { label: string; color: string }> = {
  O: { label: 'Built once', color: '#495057' },
  N: { label: 'Nightly batch', color: '#1864ab' },
  D: { label: 'On planner request', color: '#2b8a3e' },
  M: { label: 'Monthly or on drift', color: '#d9480f' },
};

export const PHASE: Record<Phase, { label: string; head: string; tint: string }> = {
  setup: { label: 'Set up', head: '#dee2e6', tint: '#f8f9fa' },
  plan: { label: 'Plan and prepare', head: '#ffec99', tint: '#fff9db' },
  build: { label: 'Build the model', head: '#d0bfff', tint: '#f3f0ff' },
  ship: { label: 'Ship it', head: '#a5d8ff', tint: '#e7f5ff' },
  run: { label: 'Run and improve', head: '#ffc9c9', tint: '#fff0f0' },
};
