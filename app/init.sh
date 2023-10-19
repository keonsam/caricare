#!/bin/bash

set -e

echo ""
echo "Updating node dependencies (npm install)"
npm --no-fund install

echo ""
echo "Starting server..."
npm run dev