#!/bin/zsh

set -e

services=(
  storage
  db
  auth
  graph
  media
)

typeset -A map
for service in ${services[@]}; do
  outputs=$((cd services/$service; serverless info -v $@) | sed -e '1,/^Stack Outputs/d' -e '$d' -e "s/^/$service/")
  outputs=("${(@f)outputs}")
  for output in $outputs; do
    key=$(echo "$output" | sed -e 's/://g' | cut -d" " -f1)
    value=$(echo "$output" | cut -d" " -f2)
    map[$key]=$value
  done
done

filepath=$PWD/config.template.yml
echo "# config.yml"
echo "# This is auto-generated using the following info. Edit at your own peril..."
echo "#    command: yarn run deploy $@"
echo "#    template: $filepath"
# USED FOR DEBUGGING
# keys=${(k)map}
# for key in ${(z)keys}; do
#   echo "#    $key: $map[$key]"
# done

echo ""
if [[ -f $filepath ]]; then
  while IFS= read -r line; do
    if [[ $line == \#* ]]; then
      continue
    fi

    key=$(echo "$line" | cut -d" " -f4)
    if [[ $key =~ ^[a-z] && $key =~ [^:]$ ]]; then
      echo ${line//$key/$map[$key]}
    else
      echo $line
    fi
  done < $filepath
else
  echo "ERROR: missing $filepath"
fi