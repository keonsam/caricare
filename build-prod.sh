# This script should force your Docker environment to a clean slate. Best run on `main` branch.
NODE_VERSION="18"

export DOCKER_DEFAULT_PLATFORM=linux/amd64

echo ""
echo "-- Running 'docker-compose down --volumes': stops containers, removes them, and any persistent volumes (eg. Postgres, Redis)..."
docker-compose -f docker-compose.prod.yml down --remove-orphans

echo ""
echo "-- Running docker-compose build..."
docker-compose -f docker-compose.prod.yml build --no-cache

# docker-compose -f docker-compose.prod.yml up