.PHONY: setup data train score plan greedy serve monitor test

VENV := .venv
PY := $(VENV)/bin/python

setup:
	python3 -m venv $(VENV) && $(PY) -m pip install -r requirements.txt

data:     ## Step 1: generate synthetic venues + weekly outcomes
	$(PY) -m src.make_data

train:    ## Step 2: train XGBoost on completions per vehicle-day
	$(PY) -m src.train

score:    ## Step 3: nightly batch, score every venue x week into the cache
	$(PY) -m src.score_batch

plan:     ## Step 4: solve the MIP per market from cached predictions
	$(PY) -m src.optimise

greedy:   ## Step 5: greedy fallback plan, compare with MIP
	$(PY) -m src.greedy

serve:    ## Step 6: on-demand re-plan API
	$(PY) -m uvicorn src.api:app --reload

monitor:  ## Step 7: drift, residuals, retrain trigger
	$(PY) -m src.monitor

test:
	$(PY) -m pytest -q
