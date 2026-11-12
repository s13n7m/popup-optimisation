"""Shared feature building, used by train AND score (no train/serve skew).

TODO
    build_features(venues, weekly) -> DataFrame
    - Rolling 30-day (4-week) aggregates per venue: past completions per vehicle-day,
      shifted so a row never sees its own week (no leakage).
    - Join static venue attributes.
    - Encode market (categorical).

Interview link: "rolling 30-day windows, refreshed daily" is your answer to
"why daily if the data is monthly?"
"""


def build_features(venues, weekly):
    raise NotImplementedError
