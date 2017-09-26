#!/bin/sh
#
# Little startup script fetches data dictionary, and runs the relay
# compiler, then webpack before launching nginx
#
set -eu

if [ -f src/img/$APP-favicon.ico src/img/favicon.ico ]; then
  cp src/img/$APP-favicon.ico src/img/favicon.ico
fi

#
# Note: GDC_SUBPATH environment variable specifies the submission-api endpoint
#    to fetch the dictionary from at startup
#
npm run schema
npm run relay
NODE_ENV=production webpack --bail

/usr/sbin/nginx -g 'daemon off;'

