"""Single place for every knob. Change scale here only.

Start small to debug fast, then scale to the real Tesla size:
    N_VENUES = 3400, N_MARKETS = 20
"""
from pathlib import Path

SEED = 42

# Scale
N_VENUES = 300          # real: 3400
N_MARKETS = 5           # real: 20
N_WEEKS = 52

# Selection bias: share of venue-weeks that historically had vehicles
SHARE_ACTIVE = 0.30

# Optimiser
WEEKLY_BUDGET_PER_MARKET = 50_000   # GBP
FLEET_PER_MARKET = 40               # vehicles
MAX_VEHICLES_PER_VENUE = 4
SOLVER_TIME_LIMIT_S = 60            # then fall back to greedy
EXPLORE_SHARE = 0.05                # slots reserved for under-tested venues

# Labels
LABEL_WINDOW_DAYS = 14              # completions counted within N days of go-live

# Paths
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
MODELS = ROOT / "models"
VENUES_PATH = DATA / "venues.parquet"
WEEKLY_PATH = DATA / "weekly.parquet"
PREDICTIONS_PATH = DATA / "predictions.parquet"   # the nightly cache
CONSTRAINTS_PATH = DATA / "constraints.parquet"   # planner overrides
DECISION_LOG_PATH = DATA / "decision_log.parquet"
PLAN_PATH = DATA / "plan.parquet"
