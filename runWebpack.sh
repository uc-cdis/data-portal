#!/bin/bash
#
# Runtime deployment helper.  Keys on environment variables:
#  NODE_ENV = auto|dev|production
#  APP = commons specific
#  HOSTNAME = where to download graphql schema from
#  LOGOUT_INACTIVE_USERS = bool, should inactive users be logged out before session lifetime ends
#  USE_INDEXD_AUTHZ = bool, should we use authz or acl field to check for unmapped files in indexd
#  WORKSPACE_TIMEOUT_IN_MINUTES = minutes after which to logout workspace user if logout_inactive false
#  TIER_ACCESS_LEVEL = the access level of a common (libre, regular or private)
#  TIER_ACCESS_LIMIT = the minimum visible count for aggregation results
#
# Script assumes npm install or npm ci has already run, and jq is installed.
#
set -e

export APP="${APP:-dev}"
export NODE_ENV="${NODE_ENV:-dev}"
export HOSTNAME="${HOSTNAME:-"revproxy-service"}"
export GEN3_BUNDLE="${GEN3_BUNDLE:-commons}"
export TIER_ACCESS_LEVEL="${TIER_ACCESS_LEVEL:-"private"}"
export TIER_ACCESS_LIMIT="${TIER_ACCESS_LIMIT:-"1000"}"
export USE_INDEXD_AUTHZ="${USE_INDEXD_AUTHZ:-"false"}"
export LOGOUT_INACTIVE_USERS="${LOGOUT_INACTIVE_USERS:-"true"}"
export WORKSPACE_TIMEOUT_IN_MINUTES="${WORKSPACE_TIMEOUT_IN_MINUTES:-"480"}"


# lib -----------------------------

declare -a gitopsFiles=(
  gitops.json data/config/gitops.json
  gitops-logo.png custom/logo/gitops-logo.png
  gitops-createdby.png custom/createdby/gitops.png
  gitops-favicon.ico custom/favicon/gitops-favicon.ico
  gitops.css custom/css/gitops.css
  gitops-sponsors custom/sponsors/gitops-sponsors
)

#
# Given the HOSTNAME of a public environment,
# set the APP environment variable and copy gitops
# config files into the local space
#
# @param hostname
#
gitops_config() {
  local hostname
  local gitRepo
  local manifestFile
  local portalApp
  local portalGitopsFolder

  gitRepo="cdis-manifest"
  hostname="$1"
  shift

  if [[ -z "$hostname" ]]; then
    echo "ERROR: gitops_config requires hostname arg"
    return 1
  fi
  if [[ "$hostname" =~ ^qa- ]]; then
    gitRepo="gitops-qa"
  elif [[ "$hostname" =~ planx-pla.net$ ]]; then
    gitRepo="gitops-dev"
  fi
  if [[ ! -d "../$gitRepo" ]]; then
    # git clone
    echo "ERROR: ../$gitRepo does not exist - please clone https://github.com/uc-cdis/${gitRepo}.git"
    return 1
  fi
  manifestFile="../$gitRepo/$hostname/manifest.json"
  if [[ ! -f "$manifestFile" ]]; then
    echo "ERROR: gitops_config - manifest does not exist $manifestFile"
    return 1
  fi
  portalApp="$(jq -r .global.portal_app < $manifestFile)"
  if [[ -z "$portalApp" ]]; then
    echo "ERROR: unable to determine portal_app from manifest at $manifestFile"
    return 1
  fi
  echo "INFO: gitops_config - setting APP=$portalApp"
  export HOSTNAME="$hostname"
  export APP="$portalApp"
  if [[ "$portalApp" == "gitops" ]]; then
    portalGitopsFolder="../$gitRepo/$hostname/portal"
    local it=0
    local copySource
    local copyDest
    while [[ $it -lt "${#gitopsFiles[@]}" ]]; do
      copySource="$portalGitopsFolder/${gitopsFiles[$it]}"
      let it=$it+1
      copyDest="./${gitopsFiles[$it]}"
      let it=$it+1
      if [[ -z "$copySource" || -z "$copyDest" ]]; then
        echo "ERROR: internal gitops processing error"
        return 1
      fi
      if [[ -f "$copySource" ]]; then
        echo "INFO: gitops_config - cp $copySource $copyDest"
        cp "$copySource" "$copyDest"
      elif [[ -d "$copySource" ]]; then
        echo "INFO: gitops_config - mkdir -p $copyDest"
        mkdir -p "$copyDest"
        echo "INFO: gitops_config - cp $copySource/*.* $copyDest/"
        cp $copySource/*.* $copyDest/
      else
        echo "INFO: gitops_config - no $copySource in gitops"
      fi
    done
  fi
}

# main -------------------

# make sure we're in the right directory
cd "$(dirname "${BASH_SOURCE}")"

if [[ "$NODE_ENV" == "auto" || "$NODE_ENV" == "autoprod" ]]; then
  if ! which jq > /dev/null; then
    echo "ERROR: NODE_ENV=auto requires the jq tool"
    echo "Install jq on ubuntu: sudo apt install jq"
    echo "   or download from https://stedolan.github.io/jq/"
    exit 1
  fi
  if [[ -z "$HOSTNAME" || "$HOSTNAME" == "revproxy-service" ]]; then
    echo "ERROR: NODE_ENV=auto requires a valid HOSTNAME environment: $HOSTNAME"
    exit 1
  fi
  if ! gitops_config "$HOSTNAME"; then
    exit 1
  fi
fi

#
# this script copies files from custom/ to src/ based
# on the current APP environment - ugh
#
bash custom/customize.sh

# workspace bundle does not currently deploy sheepdog
if [[ "$GEN3_BUNDLE" != "workspace" ]]; then
  echo "INFO: Running schema and relay for non-workspace bundle"
  # download the graphql schema for the commons from HOSTNAME
  npm run schema
  # run the relay compiler against the graphql schema
  npm run relay
fi

# generate a parameters.json file by overlaying $APP.json on default.json
echo "INFO: Generating parameters.json"
npm run params
if [[ "$GEN3_BUNDLE" != "workspace" ]]; then
  echo "INFO: Running sanity-check for non-workspace bundle"
  # run a sanity check to make sure portal config works
  npm run sanity-check
fi

export STORYBOOK_PROJECT_ID=search
export REACT_APP_PROJECT_ID=search
export REACT_APP_DISABLE_SOCKET=true

#
# finally either launch the webpack-dev-server or
# run webpack to generate a static bundle.js
#
echo "INFO: Ready for webpack"
if [[ "$NODE_ENV" == "dev" || "$NODE_ENV" == "auto" ]]; then
  echo npx webpack serve
  npx webpack serve --mode development
else
  # see https://nodejs.org/api/cli.html#cli_max_old_space_size_size_in_megabytes
  export NODE_OPTIONS='--max-old-space-size=3584'
  export NODE_ENV="production"
  echo npx webpack build
  npx webpack build --mode production
fi
