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

# TODO: generate aws config files
bin/awsconfig.py ./services awsconfig

# TODO: create amplify dir and copy schema.json
bin/amplify.sh

# TODO:  modify operations file and save in amplify dir
python bin/modify-operations-graphql.py ./services/graph/.serverless/amplify-operations.graphql ./amplify/operations.graphql

# generate config yml
bin/config.sh -s $stage > config.yml
