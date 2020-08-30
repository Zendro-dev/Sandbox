#!/usr/bin/env bash

# Create user credentials and experiment database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	CREATE USER admin WITH SUPERUSER PASSWORD 'admin';
	CREATE DATABASE async_experiment OWNER admin;
EOSQL

# Seed database
psql \
  --username admin --no-password \
  --dbname async_experiment \
  --file /data/table.sql
