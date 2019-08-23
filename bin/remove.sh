#!/bin/bash

set -e

# auth depends on storage, db
# graph depends on storage, db, auth
# media depends on storage, graph

services=(
  graph
  auth
  db
  storage
)

for service in ${services[@]}; do
  echo -e "\n=== Removing $service ===\n"
  (cd services/$service; serverless remove $@)
done
