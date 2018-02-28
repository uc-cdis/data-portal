# To run: docker run -d --name=dataportal -p 80:80 quay.io/cdis/data-portal 
# To check running container: docker exec -it dataportal /bin/bash

FROM ubuntu:16.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    curl \
    git \
    nginx \
    python \
    vim \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \ 
    && apt-get install -y --no-install-recommends nodejs \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

ARG APP=dev
ARG BASENAME

RUN mkdir -p /data-portal 
COPY . /data-portal
WORKDIR /data-portal
RUN COMMIT=`git rev-parse HEAD` && echo "export const portalCommit = \"${COMMIT}\";" >src/versions.js \
    && VERSION=`git describe --always --tags` && echo "export const portalVersion =\"${VERSION}\";" >>src/versions.js \
    && /bin/rm -rf node_modules \
    && npm install \
    && npm run relay \
    && NODE_ENV=production ./node_modules/.bin/webpack --bail \
    && cp nginx.conf /etc/nginx/conf.d/nginx.conf \
    && rm /etc/nginx/sites-enabled/default
CMD bash ./dockerStart.sh
