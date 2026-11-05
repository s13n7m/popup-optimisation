"""Step 4: Layer 2, decision. A MIP, NOT a model.

Inputs (read at solve time)
    predictions.parquet   cached pred_rate (from last night)
    constraints.parquet   CURRENT planner overrides: excluded venues, budget, fleet
Decision vars
    open[v]      binary, venue v is used this week
    cars[v]      integer 0..MAX_VEHICLES_PER_VENUE
Objective
    maximise  sum(pred_rate[v] * cars[v] * 7)
Constraints
    sum(cost_per_week[v] * open[v]) <= budget
    sum(cars[v]) <= fleet
    cars[v] <= MAX * open[v]
    open[v] = 0 for excluded venues
    reserve EXPLORE_SHARE of slots for under-tested venues

TODO
    1. solve_market(market, preds, constraints, warm_start=None) -> plan DataFrame
    2. Loop markets (decomposition = why it is fast). Time each solve.
    3. Use HiGHS via PuLP with SOLVER_TIME_LIMIT_S; on timeout call src.greedy.
    4. Write plan.parquet and append to decision_log (chosen, reason: exploit/explore).

Interview link: "the second layer is an optimiser reading cached predictions
plus fresh constraints".
"""
from src import config


def solve_market(market, preds, constraints, warm_start=None):
    raise NotImplementedError("Step 4: build me")


def main() -> None:
    raise NotImplementedError


if __name__ == "__main__":
    main()
