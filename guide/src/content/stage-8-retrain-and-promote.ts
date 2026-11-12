import { card, type Stage } from '../types';

export const stage8: Stage = {
  id: 'retrain-and-promote', num: 8, phase: 'run', eyebrow: 'RETRAIN AND GOVERN', step: 'step 7',
  title: 'Retrain and promote', branch: 'retrain-and-promote', out: 'out: new champion',
  summary: 'Retrain on a schedule or on drift, test the challenger fairly, and roll out safely by market.',
  files: ['src/monitor.py', 'src/train.py', 'decision_log.parquet', 'docs/ diagram'],
  cards: [
    card('s8-trigger', 'M', 'should_retrain(): monthly, or early on a PSI or residual breach',
      ['Write should_retrain using thresholds you can defend.', 'Run it at the end of make monitor.'], 'A drift breach triggers a retrain request.'),
    card('s8-retrain', 'M', 'Retrain on a rolling window and treat the result as a challenger',
      ['Train on the latest window.', 'Save it as a challenger, not the champion.'], 'A challenger model and its metadata exist beside the champion.'),
    card('s8-explore', 'M', 'Compare with the champion on explore rows only, the unbiased slice',
      ['Take rows from explore slots in the latest weeks.', 'Score both models on them.'], 'The comparison uses only explore rows.'),
    card('s8-shadow', 'M', 'Shadow mode: compare predictions, not decisions',
      ['Run the challenger alongside without using its output.', 'Compare predictions with actuals.'], 'You can explain why shadow mode checks predictions, not decisions.'),
    card('s8-promote', 'M', 'Promote, and keep the old champion ready for rollback',
      ['Swap the champion pointer only when the challenger wins.', 'Keep the previous version available.'], 'Rolling back takes one command.', { extra: true }),
    card('s8-rollout', 'M', 'Roll out by market with matched pairs and difference-in-differences',
      ['Treat the market as the unit, because the fleet is shared.', 'Pair similar markets and compare change over time.'], 'You can explain the design in a minute.'),
    card('s8-overrides', 'M', 'Log planner overrides so the next model can learn from them',
      ['Store each exclude and budget change with a timestamp.', 'Join it to the decision log.'], 'Overrides appear in the decision history.', { ui: true }),
    card('s8-history', 'M', 'Keep plan history so planners can look back',
      ['Save each plan with its inputs and model version.', 'Add a history view in the app.'], 'A planner can open last week’s plan.', { ui: true }),
    card('s8-ui-rollout', 'M', 'Roll out the planner app to one market at a time',
      ['Start with one market and a few planners.', 'Collect feedback before the next market.'], 'Each market launches only after the one before is stable.', { ui: true }),
  ],
};
