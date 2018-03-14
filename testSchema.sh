#!/bin/bash

set -e

declare -A testCases
testCases=(
[bpa]="data.bloodpac.org"
[bhc]="data.braincommons.org"
[dev]="dev.planx-pla.net"
[edc]="portal.occ-data.org"
[genomel]="genomel.bionimbus.org"
[gtex]="dcp.bionimbus.org"
[kf]="gen3qa.kids-first.io"
[ndh]="niaid.bionimbus.org"
)
for APP in "${!testCases[@]}"; do
  export APP
  export HOSTNAME="${testCases[$APP]}"
  npm run schema
  npm run relay
done
