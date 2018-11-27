#!/bin/bash
#
# Fetch schema, relay compile, customize, and run webpack.
# If NODE_ENV is 'dev', then run webpack -hot server.
# Script assumes npm install or npm ci has already run.
#

export APP="${APP:-dev}"
export NODE_ENV="${NODE_ENV:-dev}"
export HOSTNAME="${HOSTNAME:-"revproxy-service"}"

cd "$(dirname "${BASH_SOURCE}")"
bash custom/customize.sh

#
# Note: GDC_SUBPATH environment variable specifies the submission-api endpoint
#    to fetch the dictionary from at startup
#
npm run schema
npm run relay
npm run params

#export STORYBOOK_ARRANGER_API=localhost:3000
export STORYBOOK_PROJECT_ID=search
export REACT_APP_ARRANGER_API=/api/v0/flat-search
export REACT_APP_PROJECT_ID=search
export REACT_APP_DISABLE_SOCKET=true

if [[ "$NODE_ENV" == "dev" ]]; then
  echo ./node_modules/.bin/webpack-dev-server --hot 
  ./node_modules/.bin/webpack-dev-server --hot 
else
  export NODE_ENV="production"
  echo ./node_modules/.bin/webpack --bail
  ./node_modules/.bin/webpack --bail
fi
