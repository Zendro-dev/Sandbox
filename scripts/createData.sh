#!/usr/bin/env bash

MAX_ROWS=${1:-"1000000"}
DATA_DIR="../data"

# Ensure we are in the "data/" working directory
cd "$(dirname $0)"

# remove any existing data
rm -f $DATA_DIR/table.txt

for i in $(seq 1 $MAX_ROWS); do

  printf -v n "%07d" $i
  echo -e "${n}\trandom_text_${n}" >> $DATA_DIR/table.txt

done

# Return to previous working directory
cd - 1>/dev/null