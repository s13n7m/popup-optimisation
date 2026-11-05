# Pop-up Location Optimisation

A from-scratch rebuild of a two-layer **predict, then decide** system for choosing pop-up test-drive venues and assigning a vehicle fleet across markets. It uses synthetic data, so it is safe to share.

- **Layer 1 (predict):** XGBoost estimates completions per vehicle-day for every venue and week.
- **Layer 2 (decide):** a mixed-integer program (PuLP + HiGHS) picks venues and assigns vehicles under budget and fleet constraints, one market at a time, with a greedy fallback.

## Architecture: what is batch, what is on demand

```
                NIGHTLY BATCH (Airflow-style)                 ON DEMAND (planner clicks "re-plan")
 ┌───────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐
 │ raw data  │──▶│ features │──▶│ XGBoost  │──▶│ predictions  │──┐
 └───────────┘   └──────────┘   │  score   │   │   (cache)    │  │   ┌─────────────┐   ┌──────┐
                                └──────────┘   └──────────────┘  ├──▶│ MIP solver  │──▶│ plan │
                                                                 │   │ per market  │   └──────┘
 planner UI ──▶ constraints (exclude venue, budget, fleet) ──────┘   │ greedy if   │
                                                                     │ time limit  │
                                                                     └─────────────┘
 MONTHLY (or on drift): retrain on rolling window ▶ evaluate on explore slice ▶ shadow ▶ promote
```

**The one-liner:** predictions are batch and refreshed nightly; constraints are read fresh at solve time; the solve is fast because it is decomposed by market and warm-started. Nothing is predicted live.

## Plan (build in order)

| Step | File | Make | What you build |
|---|---|---|---|
| 0 | `requirements.txt` | `make setup` | venv + dependencies |
| 1 | `src/make_data.py` | `make data` | synthetic venues + weekly outcomes with built-in selection bias |
| 2 | `src/train.py`, `src/features.py` | `make train` | XGBoost, time split, MAE + calibration by market |
| 3 | `src/score_batch.py` | `make score` | nightly batch scoring into the prediction cache |
| 4 | `src/optimise.py` | `make plan` | MIP per market, explore slots, decision log |
| 5 | `src/greedy.py` | `make greedy` | greedy fallback, compare against the MIP |
| 6 | `src/api.py` | `make serve` | FastAPI on-demand re-plan, timed |
| 7 | `src/monitor.py` | `make monitor` | PSI, residuals, retrain trigger, champion vs challenger |
| 8 | `docs/` | | one-page diagram in your own words |

Each file has a docstring that gives its inputs, outputs and a TODO list. No solution code is included.

## Scale

All knobs are in `src/config.py`. Start with `N_VENUES = 300` and `N_MARKETS = 5`. When everything works, switch to `3400` and `20` and time the solve with and without per-market decomposition.

## Run

```bash
make setup
make data && make train && make score && make plan
make serve   # then POST /constraints and /replan/{market}
make test
```

## Interview talking points this repo should let you explain

1. **Batch vs on demand:** what is cached, what is read at solve time, why nightly is fresh enough.
2. **Why two layers:** each is testable alone, and constraints change without retraining.
3. **Why decompose by market:** solve time at 3,400 venues.
4. **Feedback loop:** you only see outcomes where you placed cars. Use per vehicle-day targets, explore slots, reweighting and a decision log.
5. **Evaluation:** time split; challenger vs champion on the explore slice only; shadow mode checks predictions, not decisions.
6. **Rollout:** market is the unit (shared fleet means interference), with matched pairs and difference-in-differences.
7. **Labels:** fixed `LABEL_WINDOW_DAYS` so recent venues are not under-counted (right-censoring).
8. **Drift:** PSI for inputs, residuals for concept drift, early retrain trigger.
9. **Payments link:** same shape as acquirer routing: predict P(approve), then a decision layer trades approval, cost and latency.

## License

MIT, see [LICENSE](LICENSE).
