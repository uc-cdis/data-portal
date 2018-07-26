#!/bin/bash

set -e

echo "RUNNING testSchema.sh"
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
count=0
while [[ count -lt ${#testCases[@]} ]]; do
  export APP=${testCases[$count]}
  let count+=1
  export HOSTNAME="${testCases[$count]}"
  let count+=1
  echo "Testing schema: $APP - $HOSTNAME"
  npm run schema
  npm run relay
done
