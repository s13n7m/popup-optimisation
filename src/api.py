"""Step 6: ON-DEMAND re-planning. No retraining, no re-scoring.

Endpoints (FastAPI)
    POST /constraints   planner edits: exclude venue, change budget/fleet
                        -> writes constraints.parquet
    POST /replan/{market}
                        -> reads cached predictions + current constraints,
                           runs optimise.solve_market (warm start from last plan),
                           returns plan + solve_seconds + used_fallback

TODO
    Build both endpoints. Time the full replan for the biggest market.
    Target: well under 3 minutes at N_VENUES = 3400.

Interview link: the full answer to "what was live?":
    batch predictions + on-demand constraints + fast solve.
"""
from fastapi import FastAPI

app = FastAPI(title="Pop-up location re-planner")


@app.get("/health")
def health():
    return {"status": "ok"}
