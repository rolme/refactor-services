#!/bin/bash

set -e

services=(
  storage
  db
  auth
  graph
  media
)

for service in ${services[@]}; do
  echo -e "\n=== $service ===\n"
  (cd services/$service; serverless info -v $@)
done
