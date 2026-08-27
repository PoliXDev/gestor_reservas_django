#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate --noinput

if [ "${RUN_SEED:-false}" = "true" ]; then
  python manage.py seed_tennis_data
fi
