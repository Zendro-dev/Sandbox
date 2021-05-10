#!/usr/bin/env bash

cd ./contexts/codegen
docker build --no-cache -f Dockerfile.code-generators -t sciencedb-code-generators:latest .
cd -
