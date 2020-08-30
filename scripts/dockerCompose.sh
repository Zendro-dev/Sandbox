#!/usr/bin/env bash

ARGS=( "$@" )
DOCKER_FILES=( )
DOCKER_FLAGS=( )
MODE=""

for arg in ${ARGS[@]}; do

  case $arg in

    --pg)
      DOCKER_FILES+=( -f docker-compose-postgres.yml )
    ;;

    up)
      MODE="up"
      DOCKER_FLAGS+=(
        --detach
        --force-recreate
        --remove-orphans
      )
    ;;

    down)
      MODE="down"
    ;;

    *)
      echo "Project flag not supported: \"$arg\""
      exit 1
    ;;
  esac

done

if [[ -z $MODE ]]; then

  echo "An <up|down> command is required for docker-compose"

  exit 2

fi

# Execute docker-compose
docker-compose ${DOCKER_FILES[@]} $MODE ${DOCKER_FLAGS[@]}

wait