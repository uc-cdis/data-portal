#!/bin/sh
#
# Little startup script fetches data dictionary, and runs the relay
# compiler, then webpack before launching nginx
#
set -eu

echo "PORTAL_HOSTNAME: $PORTAL_HOSTNAME"
export NODE_ENV=production
bash runWebpack.sh

# /usr/sbin/nginx -g 'daemon off;'
