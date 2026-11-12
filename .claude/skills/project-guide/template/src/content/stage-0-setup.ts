import { card, type Stage } from '../types';

export const stage0: Stage = {
  id: 'setup', num: 0, phase: 'setup', eyebrow: 'PRE-STAGE', step: 'step 0',
  title: 'Set up', branch: 'setup', out: 'out: repo, tooling, hosting, accounts',
  summary: 'Everything to set up once, before stage 1.',
  files: ['README.md', '.env (local only)'],
  cards: [
    card('s0-repo', 'O', 'Agree the branch plan: one branch per stage',
      ['Create each stage branch from main once the previous stage is merged.', 'Open a pull request only when a stage is done.'],
      'Every stage has a named branch.'),
    card('s0-hosting', 'O', 'Connect hosting and a database',
      ['Import the repo into the host and set the root directory for each app.', 'Create the database project and run the SQL files.'],
      'A pushed branch shows a working preview URL.'),
    card('s0-secrets', 'O', 'Keep secrets out of git',
      ['List .env in .gitignore before the first key goes in.', 'Use host environment variables online.'],
      'git log shows no key.', { extra: true }),
  ],
};
