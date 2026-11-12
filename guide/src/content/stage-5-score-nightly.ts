import { card, type Stage } from '../types';

export const stage5: Stage = {
  id: 'score-nightly', num: 5, phase: 'ship', eyebrow: 'DEPLOY: BATCH', step: 'step 3',
  title: 'Score nightly', branch: 'score-nightly', out: 'out: predictions cache',
  summary: 'Every night, score every venue and week and cache the result. Nothing is predicted live.',
  files: ['make score', 'src/score_batch.py', 'predictions.parquet'],
  cards: [
    card('s5-load', 'N', 'Load the champion and build features with the same features.py',
      ['Read models/xgb.json and its metadata.', 'Call the shared feature function.'], 'Scoring and training produce identical features for the same row.'),
    card('s5-score', 'N', 'Score every venue by week into pred_rate',
      ['Predict for all venue-weeks, including never-staffed venues.', 'Keep the result in a dataframe.'], 'Every venue and week has a pred_rate.'),
    card('s5-write', 'N', 'Write predictions.parquet with scored_at and model version',
      ['Add scored_at and model_version columns.', 'Write atomically so a reader never sees a half file.'], 'predictions.parquet opens with both columns filled.'),
    card('s5-check', 'N', 'Check the batch: row count, nulls, freshness',
      ['Compare row count with venues times weeks.', 'Fail if any pred_rate is null or negative.'], 'A bad batch stops before it replaces the cache.', { extra: true }),
    card('s5-dag', 'N', 'Run it as a nightly DAG: validate, features, score, cache, check',
      ['Write the five tasks as a small Airflow or Prefect flow, or a cron plus Makefile.', 'Add retries and an alert on failure.'], 'The pipeline runs unattended and tells you when it fails.', { extra: true }),
    card('s5-why', 'O', 'Write down why nightly is enough',
      ['Venue traits move slowly.', 'Constraints are read at solve time, so planners still get fresh answers.'], 'You can explain it in two sentences.'),
    card('s5-store-explain', 'N', 'Store drivers and confidence in the cache next to pred_rate',
      ['Add driver and confidence columns to predictions.parquet.', 'Keep them as short strings or a json column.'], 'The API can read them with no model call.', { ui: true }),
    card('s5-asof', 'N', 'Expose a data-as-of date so planners know how fresh the numbers are',
      ['Return the latest scored_at in every plan response.', 'Show it in the app header.'], 'The app shows when predictions were last updated.', { ui: true }),
  ],
};
