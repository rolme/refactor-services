#!/bin/bash

set -e

mkdir -p amplify
cp services/graph/.serverless/amplify-schema.json amplify/schema.json
