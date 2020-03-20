#!/usr/bin/python

# This script transforms operations.graphql file by replacing tour{ .. } object with tour{ id } to ease mobile clients for offline mutation while writing back to local cache 

import sys

usage = "python modify-operations-graphql.py <InputFile> <OutputFile>"

if len(sys.argv) != 3:
    if "--help" in sys.argv[1]:
        print(usage)
    print (len(sys.argv))        
    exit()

FileName = sys.argv[1]
value = open(FileName, 'r').read()
i = 1

while i < len(value) and i>0: 
    val = value.find(" tour ", i+1)
    if (val > 0):
        counter = 0
        j = val
        while j < len(value):
            if value[j] == '{':
                counter = counter+1
            elif value[j] == '}':
                counter = counter-1
                if counter == 0:    
                    value = value[:val+5] + "{\n\t\tid\t\n}" + value[j+1:]
                    break
            j = j+1
    i = val

f = open(sys.argv[2], 'w')
f.write(value)
f.close()
