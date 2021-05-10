#!/usr/bin/env bash

# 1=dev|prod
# 2=<service_name>
docker-compose -f docker-compose-$1.yml restart $2