#!/bin/bash

set -e

# auth depends on storage, db
# graph depends on storage, db, auth
# media depends on storage, graph

services=(
  storage
  db
  auth
  graph
  media
)

for service in ${services[@]}; do
  echo -e "\n=== Deploying $service ===\n"
  (cd services/$service; serverless deploy $@)
done

if [[ $SLS_DEBUG ]]; then
  ls -l services/*/.serverless/amplify*
fi

# TODO: generate aws config files
# bin/awsconfig.py ./services awsconfig

# TODO: create amplify dir and copy schema.json
# bin/amplify.sh

# TODO:  modify operations file and save in amplify dir
# python bin/modify-operations-graphql.py ./services/graph/.serverless/amplify-operations.graphql ./amplify/operations.graphql

# generate exports yml
bin/exports.sh $@ > exports.yml
