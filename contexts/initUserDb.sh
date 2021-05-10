#!/bin/bash
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	CREATE USER phenomisdb WITH SUPERUSER PASSWORD 'phenomisdb';
	CREATE DATABASE untwistdb_development OWNER phenomisdb;
	CREATE DATABASE untwistdb_test OWNER phenomisdb;
	CREATE DATABASE untwistdb_production OWNER phenomisdb;
EOSQL
