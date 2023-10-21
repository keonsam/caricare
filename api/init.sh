#!/bin/bash

set -e

echo ""
echo "Updating node dependencies (npm install)"
npm --no-fund install
# npm ci

echo ""
echo "Database migration script"
npx ts-node scripts/run-migrations.ts

echo ""
echo "Starting server..."
npm start