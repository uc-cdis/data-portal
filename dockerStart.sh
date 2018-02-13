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

if [ -f custom/graphql/$APP-gql.njk ]; then
  cat custom/graphql/gqlHeader.njk custom/graphql/$APP-gql.njk custom/graphql/gqlFooter.njk >data/gqlHelper.js.njk
else
  cat custom/graphql/gqlHeader.njk custom/graphql/gqlDefault.njk custom/graphql/gqlFooter.njk >data/gqlHelper.js.njk
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
npm run relay
NODE_ENV=production webpack --bail

/usr/sbin/nginx -g 'daemon off;'

