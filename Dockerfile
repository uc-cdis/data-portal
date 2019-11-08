# To run: docker run -d --name=dataportal -p 80:80 quay.io/cdis/data-portal
# To check running container: docker exec -it dataportal /bin/bash

FROM ubuntu:16.04

ENV DEBIAN_FRONTEND=noninteractive
ENV REACT_APP_PROJECT_ID=search
ENV REACT_APP_ARRANGER_API=/api/v0/flat-search

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    curl \
    git \
    nginx \
    python \
    vim \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

ARG APP=dev
ARG BASENAME

RUN mkdir -p /data-portal
COPY . /data-portal
WORKDIR /data-portal
RUN COMMIT=`git rev-parse HEAD` && echo "export const portalCommit = \"${COMMIT}\";" >src/versions.js \
    && VERSION=`git describe --always --tags` && echo "export const portalVersion =\"${VERSION}\";" >>src/versions.js \
    && /bin/rm -rf .git \
    && /bin/rm -rf node_modules \
    && npm config set unsafe-perm=true && npm ci \
    && npm run relay \
    && npm run params \
    && NODE_OPTIONS=--max-old-space-size=4096 NODE_ENV=production ./node_modules/.bin/webpack --bail \
    && cp nginx.conf /etc/nginx/conf.d/nginx.conf \
    && rm /etc/nginx/sites-enabled/default

# In standard prod these will be overwritten by volume mounts
# Provided here for ease of use in development and
# non-standard deployment environments

RUN mkdir /mnt/ssl \
    && openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /mnt/ssl/nginx.key -out /mnt/ssl/nginx.crt -subj '/countryName=US/stateOrProvinceName=Illinois/localityName=Chicago/organizationName=CDIS/organizationalUnitName=PlanX/commonName=localhost/emailAddress=ops@cdis.org'

CMD bash ./dockerStart.sh
