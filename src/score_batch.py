"""Step 3: the NIGHTLY BATCH. This is the only place the ML model runs.

Input   latest features for EVERY candidate venue x upcoming week
Output  data/predictions.parquet: venue_id, week, pred_rate, model_version, scored_at

TODO
    1. Load model + features for all venues (not just past-active ones).
    2. Predict, stamp model_version and scored_at.
    3. Overwrite the cache.

Interview link: "predictions are batch, refreshed nightly. Nothing is predicted live."
"""
from src import config


def main() -> None:
    raise NotImplementedError("Step 3: build me")


if __name__ == "__main__":
    main()
