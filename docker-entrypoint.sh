#!/bin/sh
set -e

echo "Running database migrations..."
prisma migrate deploy 2>/dev/null || prisma db push --accept-data-loss

echo "Starting StudyPilot..."
exec node server.js
