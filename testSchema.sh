#!/bin/bash

set -e

# Do not use associative arrays - not supported on Mac!
declare -a testCases
testCases=(
default "generic.planx-pla.net"
)
index=0
while [[ $index -lt ${#testCases[@]} ]]; do
  APP=${testCases[$index]}
  let index+=1
  HOSTNAME=${testCases[$index]}
  let index+=1
  export APP
  export HOSTNAME
  echo "Run setup for $APP $HOSTNAME"
  npm run schema
  npm run relay
done
