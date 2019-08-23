#!/bin/bash

set -e

services=(
  storage
  db
  auth
  graph
)

for service in ${services[@]}; do
  (cd services/$service; serverless info -v $@) | sed -e '1,/^Stack Outputs/d' -e '$d' -e "s/^/$service/"
done
