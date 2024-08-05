#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Wait for the PostgreSQL database to be available
/app/wait-for-it.sh db:5432 --timeout=30 --strict -- echo "PostgreSQL is up - executing command"

# Run database migrations
/opt/venv/bin/python manage.py makemigrations accounts --noinput
/opt/venv/bin/python manage.py makemigrations --noinput
/opt/venv/bin/python manage.py migrate --noinput

# Collect static files
/opt/venv/bin/python manage.py collectstatic --noinput

# Start the server
/opt/venv/bin/gunicorn main.wsgi:application --bind 0.0.0.0:8000 --workers 3 --certfile=/app/localhost.crt --keyfile=/app/localhost.key
