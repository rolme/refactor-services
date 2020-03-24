#!/usr/bin/env python3

import glob, os
import sys
import json
import yaml
try:
  from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
  from yaml import Loader, Dumper

from jsonmerge import merge

clients = ["ios"]

# create awsconfig directory
os.makedirs('./awsconfig', exist_ok=True)

# create the client directories
os.makedirs('./awsconfig/ios', exist_ok=True)

# open template
with open('./awsconfiguration.template.json', "r") as template:
  jsonData = json.load(template)

# load the config.yml data
with open('./config.yml', "r") as config:
  yamlData = yaml.load(config, Loader=Loader)

# replace content of template with values from config.yml
jsonData["AppSync"]["Default"]["ApiUrl"] = yamlData["ios"]["appSyncApiUrl"]
jsonData["AppSync"]["Default"]["Region"] = yamlData["ios"]["awsRegion"]
jsonData["CognitoUserPool"]["Default"]["PoolId"] = yamlData["ios"]["cognitoUserPoolId"]
jsonData["CognitoUserPool"]["Default"]["AppClientId"] = yamlData["ios"]["cognitoUserPoolClientId"]
jsonData["CognitoUserPool"]["Default"]["Region"] = yamlData["ios"]["awsRegion"]
jsonData["CredentialsProvider"]["CognitoIdentity"]["Default"]["PoolId"] = yamlData["ios"]["cognitoIdentityPool"]
jsonData["CredentialsProvider"]["CognitoIdentity"]["Default"]["Region"] = yamlData["ios"]["awsRegion"]
# write new awsconfiguration.json
with open('./awsconfig/ios/awsconfiguration.json', "w") as awsconfig:
  awsconfig.write(json.dumps(jsonData, indent=2, sort_keys=True))

print("done")
