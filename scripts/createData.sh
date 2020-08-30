#!/usr/bin/env bash

MAX_ROWS=${1:-"10000"}
DATA_DIR="../data"

# Ensure we are in the "data/" working directory
cd "$(dirname $0)"

# remove any existing data
cat $DATA_DIR/header.sql > $DATA_DIR/table.sql

for i in $(seq 1 $MAX_ROWS); do

  printf -v n "%05d" $i
  echo -e "${n}\trandom_text_${n}" >> $DATA_DIR/table.sql

done

# Return to previous working directory
cd - 1>/dev/null