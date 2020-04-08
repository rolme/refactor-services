#!/usr/bin/env python3

import graphql
import re
import os
import shutil
import sys

amplify_dir = "amplify"
serverless_dir = os.path.join("services", "graph", ".serverless")

amplify_operations_graphql = "amplify-operations.graphql"
amplify_schema_json = "amplify-schema.json"
schema_file = os.path.join("services", "graph", "schema.graphql")


def main():
  print("\n=== Generating Amplify files ===")
  
  # with open(schema_file, "r") as source:
  #   document = graphql.parse(source.read())

  os.makedirs(amplify_dir, exist_ok=True)
  shutil.copy(os.path.join(serverless_dir, amplify_schema_json), os.path.join(amplify_dir, "schema.json"))
  print(f"created {os.path.join(amplify_dir, 'schema.json')}")
  shutil.copy(os.path.join(serverless_dir, amplify_operations_graphql), os.path.join(amplify_dir,"operations.graphql"))
  print(f"created {os.path.join(amplify_dir, 'operations.graphql')}")
  print("TODO: generate a parsed schema.graphql for amplify mobile")
  print("done")

main()
