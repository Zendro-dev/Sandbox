#!/usr/bin/env bash

ARGS=( "$@" )
DATA_DIR="../data"
DOCKER_FILES=( docker-compose-db.yml )
DOCKER_FLAGS=( -v )

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

    # clean all projects
    --all)
      DOCKER_FILES+=(  docker-compose-pgp.yml )
    ;;

    # clean data
    --data)
      cleanData
      DOCKER_FLAGS+=( --rmi all )
    ;;

    # pg-promise clean
    --pgp)
      DOCKER_FILES=( docker-compose-pgp.yml )
    ;;

    # catch unsupported options
    *)
      echo "ERROR: invalid clean option: \"$arg\""
      exit 1
    ;;

  esac

done

# Execute clean arguments
for file in ${DOCKER_FILES[@]}; do
  docker-compose -f $file down $DOCKER_FLAGS
done