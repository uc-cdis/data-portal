#!/bin/bash
#
# Little helper script deploys runtime
# injected configuration overrides like
# css theming, logo graphics, and translation text
#

# cd to root of data-portal/ repo
cd "$(dirname $(dirname "${BASH_SOURCE}"))"
set -v
APP="${APP:-dev}"

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
  cp custom/css/$APP.css src/css/themeoverrides.css
else
  echo "/* generated file - see customize.sh */" > src/css/themeoverrides.css
fi

if [ -d custom/sponsors/$APP-sponsors ]; then
  cp -r custom/sponsors/$APP-sponsors src/img/sponsors
fi
