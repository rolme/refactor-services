#!/usr/bin/env python3

import re
import os
import sys
import yaml
try:
  from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
  from yaml import Loader, Dumper

aws_config_dir   = "awsconfig"
aws_config_file  = 'awsconfiguration.json'
clients          = ["android", "ios"]
config_template  = 'awsconfiguration.template.json'
config_yaml_file = 'config.yml'

def parse_template(client, config_yaml):
  aws_config_data = []
  with open(config_template, "r") as template:
    line = template.readline()
    while line:
      key = re.findall(r"\[(.*)\]", line)
      if len(key) > 0:
        line = line.replace(f"[{key[0]}]", config_yaml[client][key[0]])
      aws_config_data.append(line.rstrip())
      line = template.readline()
    template.close()

  return aws_config_data

def generate_aws_config(client, aws_config_data):
  aws_config_client_dir = os.path.join(aws_config_dir, client)
  aws_config_fullpath = os.path.join(aws_config_dir, client, aws_config_file)

  os.makedirs(aws_config_client_dir, exist_ok=True)
  with open(aws_config_fullpath, "w") as awsconfig:
    awsconfig.write("\n".join(aws_config_data))
    awsconfig.close()
  return aws_config_fullpath

def main():
  print ("\n=== Generating AWS configuration ===")
  config_yaml = yaml.load(open(config_yaml_file, "r"), Loader=Loader)

  for client in clients:
    aws_config_data = parse_template(client, config_yaml)
    aws_config_fullpath = generate_aws_config(client, aws_config_data)
    print(f"created {aws_config_fullpath}")
  print("done")

main()
