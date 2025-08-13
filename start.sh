#!/bin/bash

PORT=${1:-8080}
uv run python3 app.py --host=0.0.0.0 --port=$PORT