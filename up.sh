#!/usr/bin/env bash

set -e

# Initialize docker-compose containers
docker-compose \
  -f './spa_refactor/docker-compose.yml' up -d
  
