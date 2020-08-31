#!/usr/bin/env bash

cd $(dirname $0)

SQLITE_DIR="../experiments/async-sqlite"

for i in $(seq 1 5); do

  printf -v n "%02d" $i

  # Create database_<n>.db and import data
  sqlite3 -batch $SQLITE_DIR/database_${n}.db < header_sqlite.sql

done

cd - 1>/dev/null