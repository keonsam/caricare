#!/bin/bash

set -e

docker-compose down
docker-compose -f docker-compose.yml -f docker-compose.testing.yml --profile test build
docker-compose -f docker-compose.yml -f docker-compose.testing.yml up --force-recreate --abort-on-container-exit api-tests db