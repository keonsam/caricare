#!/usr/bin/env bash
set -e

# Display Help
help()
{
   echo "Usage: $0 [-d|-h|-y]"
   echo ""
   echo "-d    run docker containers in detached mode"
   echo "-h    print this help"
   echo "-y    answer yes to all internal prompts"
   echo
}

# Get command line options
DOCKER_OPTIONS=""
while getopts "dhy" options; do 
    case "${options}" in
        d)
            DOCKER_OPTIONS="--detach"
            ;;
        h)
            help
            exit 0
            ;;
        y)
            RUN_UP="true"
            ;;
    esac
done

# This script should force your Docker environment to a clean slate. Best run on `main` branch.
NODE_VERSION="18"

echo ""
echo "-- Running 'docker-compose down --volumes': stops containers, removes them, and any persistent volumes (eg. Postgres, Redis)..."
docker-compose down --remove-orphans

echo ""
echo "-- Running docker-compose build..."
docker-compose build --pull

# up
echo ""
if [ -z ${RUN_UP+x} ]; then     
    read -p "Run 'docker-compose up' [y/n]? " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        RUN_UP="true"
    fi
fi

if [ $RUN_UP = "true" ]; then
    echo "-- Running 'docker-compose up $DOCKER_OPTIONS'..."
    docker-compose up $DOCKER_OPTIONS
fi
