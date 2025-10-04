#!/bin/bash

# Usage: ./migrate.sh "Migration message"
alembic revision --autogenerate -m "$1" && alembic upgrade head
