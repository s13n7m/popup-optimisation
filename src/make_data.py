"""Step 1: synthetic data.

Output
    data/venues.parquet  venue_id, market, footfall, pop_density, avg_income,
                         dist_to_store_km, cost_per_week
    data/weekly.parquet  venue_id, week, season_index, local_event,
                         vehicles_assigned, completions

TODO
    1. Build the venues table (N_VENUES rows, spread across N_MARKETS).
    2. Build venue x week rows. season_index = a sine wave over the year.
    3. Only SHARE_ACTIVE of rows get vehicles_assigned > 0 (selection bias!).
       Make it NOT random: favour high-footfall venues, like a human planner would.
    4. Write a hidden "true" rate per vehicle-day:
           base + footfall + income x season + event bump - distance + market offset
    5. completions = Poisson(rate * vehicles_assigned * 7)
    6. Save both tables. Print completions per vehicle-day by market (expect ~1 to 6).

Interview link: you now KNOW the ground truth, so you can measure bias later.
"""
from src import config


def main() -> None:
    raise NotImplementedError("Step 1: build me")


if __name__ == "__main__":
    main()
