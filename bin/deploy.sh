#!/bin/bash

set -e

# auth depends on storage, db
# graph depends on storage, db, auth
# media depends on storage, graph

if [[ $2 == "branch" ]]; then
 stage="branch-$RANDOM"
else
 stage=$2
fi

services=(
  storage
  db
  auth
  graph
  media
)

for service in ${services[@]}; do
  printf "\n=== Deploying $service ($stage) ===\n"
  (cd services/$service; serverless deploy -s $stage)
done

if [[ $SLS_DEBUG ]]; then
  ls -l services/*/.serverless/amplify*
fi

# generate config yaml file
bin/config.sh -s $stage > config.yml

# Generate aws config files
bin/awsconfig.py

# Generate amplify dir and copy schema.json and operations.graphql
bin/amplify.py
