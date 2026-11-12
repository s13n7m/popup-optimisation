import { card, type Stage } from '../types';

export const stage1: Stage = {
  id: 'data', num: 1, phase: 'plan', eyebrow: 'DATA', step: 'step 1',
  title: 'Build the data', branch: 'build-the-data', out: 'out: clean data files',
  summary: 'Get the data the rest of the project depends on.',
  files: ['make data', 'src/make_data.py'],
  cards: [
    card('s1-source', 'O', 'Pull the base dataset from the main source',
      ['Open the Sources tab and follow the steps for the main source.', 'Save the result as a file in data/.'],
      'The file opens and has the columns you expect.'),
    card('s1-checks', 'O', 'Add data checks: schema, row counts, nulls',
      ['Write a validate function that runs at the end of the build.', 'Make it fail loudly on bad rows.'],
      'Corrupting one column makes the build fail.', { extra: true }),
    card('s1-contract', 'O', 'Agree the interface the frontend needs',
      ['Write the fields the frontend will read.', 'Keep them in one shared file.'],
      'Both sides use the same field names.', { ui: true }),
  ],
};
