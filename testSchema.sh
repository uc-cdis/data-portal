#!/bin/bash

set -e

# Do not use associative arrays - not supported on Mac!
declare -a testCases
testCases=(
bpa "data.bloodpac.org"
dcf "nci-crdc.datacommons.io"
gtex "gen3.biodatacatalyst.nhlbi.nih.gov"
anvil "gen3.theanvil.io"
dev "qa.planx-pla.net"
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
