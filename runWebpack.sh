#!/bin/bash
#
# Runtime deployment helper.  Keys on environment variables:
#  NODE_ENV = development|production
#  APP = commons specific
#  HOSTNAME = where to download graphql schema from
#  LOGOUT_INACTIVE_USERS = bool, should inactive users be logged out before session lifetime ends
#  USE_INDEXD_AUTHZ = bool, should we use authz or acl field to check for unmapped files in indexd
#  WORKSPACE_TIMEOUT_IN_MINUTES = minutes after which to logout workspace user if logout_inactive false
#  TIER_ACCESS_LEVEL = the access level of a common (libre, regular or private)
#  TIER_ACCESS_LIMIT = the minimum visible count for aggregation results
#  DICTIONARY_URL = url for th current instance of the data dictionary so we can extract version info at build time
#
# Script assumes npm install or npm ci has already run, and jq is installed.
#
set -e

export APP="${APP:-dev}"
export NODE_ENV="${NODE_ENV:-development}"
export HOSTNAME="${HOSTNAME:-"revproxy-service"}"
export DICTIONARY_URL="${DICTIONARY_URL:-""}"
export TIER_ACCESS_LEVEL="${TIER_ACCESS_LEVEL:-"private"}"
export TIER_ACCESS_LIMIT="${TIER_ACCESS_LIMIT:-"1000"}"
export USE_INDEXD_AUTHZ="${USE_INDEXD_AUTHZ:-"false"}"
export LOGOUT_INACTIVE_USERS="${LOGOUT_INACTIVE_USERS:-"true"}"
export WORKSPACE_TIMEOUT_IN_MINUTES="${WORKSPACE_TIMEOUT_IN_MINUTES:-"480"}"

# make sure we're in the right directory
cd "$(dirname "${BASH_SOURCE}")"
# download the graphql schema for the commons from HOSTNAME
npm run schema
# create a graphviz layout from dictionary
npm run graphviz-layout
# run the relay compiler against the graphql schema
npm run relay
# generate a parameters.json file by overlaying $APP.json on default.json
npm run params
# run a sanity check to make sure portal config works
npm run sanity-check

export STORYBOOK_PROJECT_ID=search
export REACT_APP_PROJECT_ID=search
export REACT_APP_DISABLE_SOCKET=true

if [[ "$NODE_ENV" == "production" ]]; then
  echo npx webpack
  npx webpack
else
  echo npx webpack serve
  npx webpack serve
fi
