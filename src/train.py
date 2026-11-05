"""Step 2: Layer 1, prediction.

Target    completions per vehicle-day (only rows with vehicles_assigned > 0)
Split     by TIME: train on weeks < T, validate on the last 4 weeks
Model     XGBoost regressor (try objective="count:poisson")
Report    MAE overall and by market; calibration (predicted vs actual by decile)
Save      models/xgb.json + metadata (train window, features, metrics)

TODO
    1. Load data, build features (src.features).
    2. Time split. Never random split here.
    3. Train, evaluate, save.
    4. Bonus: inverse-propensity weights so under-sampled venues count more
       (clip the weights).

Interview link: selection bias, calibration, time split.
"""
from src import config


def main() -> None:
    raise NotImplementedError("Step 2: build me")


if __name__ == "__main__":
    main()
