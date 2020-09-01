#!/usr/bin/env bash

ARGS=( "$@" )
DATA_DIR="../data"
PROJECT_FILES=( )
DOCKER_FILES=( )
DOCKER_FLAGS=( -v --rmi all )

# Remove generated data table
cleanData() {

  # Change to the "scripts/" working directory
  cd "$(dirname $0)"

  rm -f $DATA_DIR/table.sql

  # Return to previous working directory
  cd - 1>/dev/null

}

# Execute the relevant option
for arg in ${ARGS[@]}; do

  case $arg in

    # clean all projects and docker images
    --all)
      cleanData
      DOCKER_FILES+=( docker-compose-postgres.yml )
      PROJECT_FILES+=( experiments/async-sqlite/database_*.db )
    ;;

    # clean data
    --data)
      cleanData
    ;;

    # pg-promise clean
    --pg)
      DOCKER_FILES+=( docker-compose-postgres.yml )
    ;;

    --sqlite)
      PROJECT_FILES+=( experiments/async-sqlite/database_*.db )
    ;;

    # catch unsupported options
    *)
      echo "ERROR: invalid clean option: \"$arg\""
      exit 1
    ;;

  esac

done

# Clean docker-compose images, volumes, and containers
for file in ${DOCKER_FILES[@]}; do
  docker-compose -f $file down ${DOCKER_FLAGS[@]}
done

# Clean project files
for file in ${PROJECT_FILES[@]}; do
  rm -f $file
done
