#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy 2>/dev/null || npx prisma db push --accept-data-loss

echo "Starting StudyPilot..."
exec node server.js
