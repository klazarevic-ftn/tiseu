#!/bin/sh

python -c "from utils.db_utils import init_db; init_db()"

exec uvicorn main:app --host 0.0.0.0 --port 8086
