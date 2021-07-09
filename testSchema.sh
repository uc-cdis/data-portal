#!/bin/bash

set -e

# Do not use associative arrays - not supported on Mac!
declare -a testCases
testCases=(
bpa "data.bloodpac.org"
gtex "gen3.biodatacatalyst.nhlbi.nih.gov"
dev "qa.planx-pla.net"
edc "portal.occ-data.org"
genomel "genomel.bionimbus.org"
acct "acct.bionimbus.org"
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
