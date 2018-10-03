#!/bin/bash

set -e

# Do not use associative arrays - not supported on Mac!
declare -a testCases
testCases=(
bpa "data.bloodpac.org"
bhc "data.braincommons.org"
gtex "dcp.bionimbus.org"
dev "dev.planx-pla.net"
edc "portal.occ-data.org"
genomel "genomel.bionimbus.org"
kfDcfInterop "dcf-interop.kidsfirstdrc.org"
ndh "niaid.bionimbus.org"
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

