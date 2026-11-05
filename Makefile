.PHONY: setup data train score plan greedy serve monitor test

setup:
	python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt

data:     ## Step 1: generate synthetic venues + weekly outcomes
	python -m src.make_data

train:    ## Step 2: train XGBoost on completions per vehicle-day
	python -m src.train

score:    ## Step 3: nightly batch, score every venue x week into the cache
	python -m src.score_batch

plan:     ## Step 4: solve the MIP per market from cached predictions
	python -m src.optimise

greedy:   ## Step 5: greedy fallback plan, compare with MIP
	python -m src.greedy

serve:    ## Step 6: on-demand re-plan API
	uvicorn src.api:app --reload

monitor:  ## Step 7: drift, residuals, retrain trigger
	python -m src.monitor

test:
	pytest -q
