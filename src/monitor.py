"""Step 7: lifecycle.

Three levels
    pipeline health   did the batch run, row counts, nulls, scored_at freshness
    model health      PSI per feature (train vs latest); residuals = predicted vs
                      actual by market (catches CONCEPT drift PSI misses)
    decision health   MIP plan still beats greedy?

TODO
    1. psi(expected, actual, bins=10)
    2. residuals_by_market(predictions, actuals)
    3. should_retrain() -> bool, using thresholds you choose (PSI > 0.2 is a common rule of thumb)
    4. Evaluate challenger vs champion ONLY on explore rows from the latest weeks
       (the unbiased slice).

Bonus: inject drift into make_data (change the income x season effect after week 40)
and check that residuals catch it before PSI does.
"""


def psi(expected, actual, bins: int = 10) -> float:
    raise NotImplementedError


if __name__ == "__main__":
    raise NotImplementedError("Step 7: build me")
