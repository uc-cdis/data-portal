#!/bin/sh
#
# Little startup script fetches data dictionary, and runs the relay
# compiler, then webpack before launching nginx
#
set -eu

if [ -f custom/favicon/$APP-favicon.ico ]; then
  cp custom/favicon/$APP-favicon.ico src/img/favicon.ico
fi

if [ -f custom/logo/$APP-logo.png ]; then
  cp custom/logo/$APP-logo.png src/img/logo.png
fi

if [ -f custom/createdby/$APP.png ]; then
  cp custom/createdby/$APP.png src/img/cdis.png
fi

if [ -f custom/css/$APP.css ]; then
  cp custom/css/$APP.css src/css/themeoverride.css
fi

rm -rf custom

#
# Note: GDC_SUBPATH environment variable specifies the submission-api endpoint
#    to fetch the dictionary from at startup
#
npm run schema
until [$? -eq 0]
do
    sleep 5
    npm run schema
done
npm run relay
npm run params
NODE_ENV=production ./node_modules/.bin/webpack --bail

/usr/sbin/nginx -g 'daemon off;'
