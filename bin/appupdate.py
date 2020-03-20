#!/usr/bin/env python3

# This module updates the client apps with aws configuration and other generated files

import glob, os
import sys
from shutil import copyfile

appType = None
projectRoot = None


def printUsage():
    print("appupdate [android|ios] <projectRoot>")


def updateAndroid():
    androidConfigFile = os.path.join("awsconfig", "android", "awsconfiguration.json")
    dest = os.path.join(projectRoot, "app", "src", "main", "res", "raw", "awsconfiguration.json")
    copyfile(androidConfigFile, dest)
    print("Copying " + androidConfigFile + " ==> " + dest)

    androidOperationsFile = os.path.join("amplify", "android", "operations.graphql")
    dest = os.path.join(projectRoot, "app", "src", "main", "graphql", "com", "amazonaws",
                                       "amplify", "generated", "graphql", "operations.graphql")
    copyfile(androidOperationsFile, dest)
    print("Copying " + androidOperationsFile + " ==> " + dest)

    androidSchemaFile = os.path.join("amplify", "android", "schema.json")
    dest = os.path.join(projectRoot, "app", "src", "main", "graphql", "schema.json")
    copyfile(androidSchemaFile, dest)
    print("Copying " + androidSchemaFile + " ==> " + dest)

def updateIOS():
    iosConfigFile = os.path.join("awsconfig", "ios", "awsconfiguration.json")
    dest = os.path.join(projectRoot, "Tourre", "Sources", "awsconfiguration.json")
    copyfile(iosConfigFile, dest)
    print("Copying " + iosConfigFile + " ==> " + dest)

    iosAPIFile = os.path.join("amplify", "ios", "graphQLApi.swift")
    dest = os.path.join(projectRoot, "Tourre", "Sources", "graphQLApi.swift")
    copyfile(iosAPIFile, dest)
    print("Copying " + iosAPIFile + " ==> " + dest)

if len(sys.argv) > 2 and sys.argv[2] != None:
    appType = sys.argv[1]
    projectRoot = sys.argv[2]
else:
    printUsage()
    exit()

if (sys.argv[1] == "android"):
    updateAndroid()
elif (sys.argv[1] == "ios"):
    updateIOS()
else:
    printUsage()
