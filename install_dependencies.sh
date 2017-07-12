#!/bin/bash
env
apt-get update && apt-get install -y --no-install-recommends build-essential curl git nginx python vim
curl -sL https://deb.nodesource.com/setup_4.x | bash 
apt-get install -y --no-install-recommends nodejs npm
ln -s /usr/bin/nodejs /usr/bin/node
npm install webpack -g
ln -sf /dev/stdout /var/log/nginx/access.log
ln -sf /dev/stderr /var/log/nginx/error.log
cp $APP-index.html index.html
cp src/img/$APP-favicon.ico src/img/favicon.ico
npm install
NODE_ENV=production webpack
cp nginx.conf /etc/nginx/conf.d/nginx.conf
rm /etc/nginx/sites-enabled/default
