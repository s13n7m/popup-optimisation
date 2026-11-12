import { card, type Stage } from '../types';

export const stage3: Stage = {
  id: 'train-the-model', num: 3, phase: 'build', eyebrow: 'MODEL DEV', step: 'step 2',
  title: 'Train the model', branch: 'train-the-model', out: 'out: trained XGBoost model',
  summary: 'Predict completions per vehicle-day from venue and week features, split by time.',
  files: ['make train', 'src/features.py', 'src/train.py'],
  cards: [
    card('s3-features', 'O', 'Write features.py once and use it for training and scoring alike',
      ['Put every feature calculation in one function in src/features.py.', 'Import it from both train.py and score_batch.py.'],
      'No feature logic exists outside features.py.'),
    card('s3-split', 'O', 'Split by time: train on weeks before T, validate on the last 4',
      ['Pick T so the last 4 weeks are held out.', 'Never use a random split.'],
      'Validation weeks are strictly after training weeks.'),
    card('s3-xgb', 'O', 'Train XGBoost with count:poisson on rows that had cars',
      ['Filter to vehicles_assigned above 0.', 'Target is completions per vehicle-day.', 'Try objective count:poisson.'],
      'The model trains and beats a constant prediction on validation.'),
    card('s3-ipw', 'O', 'Bonus: inverse-propensity weights, clipped, so under-sampled venues count more',
      ['Estimate the chance each venue-week was staffed.', 'Weight rows by one over that chance and clip the weights.', 'Compare error on never-staffed venues, using the hidden truth.'],
      'You can show whether weighting reduced bias.'),
    card('s3-log', 'O', 'Log params, data window and metrics for every run',
      ['Write a small json per run with params, window, features and metrics.', 'Keep it beside the model file.'],
      'Every trained model has a matching metadata file.', { extra: true }),
    card('s3-drivers', 'O', 'Output per-venue drivers so the planner can read why a venue was picked',
      ['Use XGBoost pred_contribs or SHAP to get each feature effect.', 'Map each feature to a plain phrase from the glossary.', 'Keep the top two or three per venue.'],
      'A function returns two or three plain-language drivers per venue.', { ui: true }),
  ],
};
