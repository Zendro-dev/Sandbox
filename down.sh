#!/usr/bin/env bash

set -e

docker-compose -f './spa_refactor/docker-compose.yml' down -v