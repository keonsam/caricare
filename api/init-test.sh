#!/bin/bash

if [[ ! -d "/app/node_modules/" ]]; then
	echo ""
	echo "Installing node dependencies (npm ci)"
	npm ci
fi

echo ""
echo "Running tests..."
npm test