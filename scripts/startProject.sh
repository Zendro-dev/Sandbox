#!/usr/bin/env bash

DOCKER_FILES=( -f docker-compose-db.yml )

case $1 in

  --pgp)
    DOCKER_FILES+=( -f docker-compose-pgp.yml )
  ;;

  *)
    echo "Project flag not supported: \"$1\""
  ;;
esac


# Execute docker-compose
docker-compose ${DOCKER_FILES[@]} up --force-recreate --remove-orphans