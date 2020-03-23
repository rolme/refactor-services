#!/usr/bin/env python3

from os import listdir
from os.path import isfile, join
from os import walk
import glob, os
import sys
import json
from jsonmerge import merge
#from pprint import pprint
import traceback

awsconfigFiles = []

mydir = "./services"
configurationDir = "awsconfig"
configTypes = ["android", "ios"]

usage = "python awsconfig.py <directoryToScan> [outputDirectory]"

    # Run through the list of configuration files assembling content into one json structure
def buildConfig(files):
    awsconfig = json.loads("{}")
    for awsconfigFile in files:
        with open(awsconfigFile, "r") as jfile:
            jsonOutput = json.load(jfile)
            out = merge(awsconfig, jsonOutput)
            awsconfig = out
    return awsconfig

    # find aws configuration files and create a single file
def constructAwsConfig(thedir, match, outfile):
    # find the various configuration files
    for root, dirs, files in os.walk(thedir):
        for file in files:
            if (match in file):
                awsconfigFiles.append(os.path.join(root, file))

        # assemble them into one json object
    configOutput = buildConfig(awsconfigFiles)

        # show it
    #pprint(json.dumps(configOutput, indent=4, sort_keys=True))

        # write it
    with open(outfile, "w") as jfile:
        jfile.write(json.dumps(configOutput, indent=4, sort_keys=True))

if len(sys.argv) > 1 and sys.argv[1] != None:
    if "--help" in sys.argv[1]:
        print(usage)
        exit()

    mydir = sys.argv[1]

if len(sys.argv) > 2 and sys.argv[2] != None:
    configurationDir = sys.argv[2]

for configuration in configTypes:
    outdir = os.path.join(configurationDir, configuration)
    os.makedirs(outdir, exist_ok=True)
    try:
        constructAwsConfig(mydir, configuration+"-awsconfiguration.json", os.path.join(outdir, "awsconfiguration.json"))
    except BaseException as e:
        print("Failed to build awsconfig for configuration `"+configuration+"`: "+str(e))
        traceback.print_exc()
        exit(1)

print("done")
