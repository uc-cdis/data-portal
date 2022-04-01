# To run: docker run -d --name=dataportal -p 80:80 quay.io/cdis/data-portal
# To check running container: docker exec -it dataportal /bin/bash

FROM quay.io/cdis/ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV REACT_APP_PROJECT_ID=search

# disable npm 7's brand new update notifier to prevent Portal from stuck at starting up
# see https://github.com/npm/cli/issues/3163
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libssl1.1 \
    libgnutls30 \
    ca-certificates \
    curl \
    git \
    nginx \
    python3 \
    time \
    vim \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log \
    && npm install -g npm@8.5

ARG APP=dev
ARG BASENAME

RUN mkdir -p /data-portal
COPY . /data-portal
WORKDIR /data-portal
RUN COMMIT=`git rev-parse HEAD` && echo "export const portalCommit = \"${COMMIT}\";" >src/versions.js \
    && VERSION=`git describe --always --tags` && echo "export const portalVersion =\"${VERSION}\";" >>src/versions.js \
    && /bin/rm -rf .git \
    && /bin/rm -rf node_modules
RUN npm config set unsafe-perm=true \
    && npm ci \
    && npm run relay \
    && npm run params
    # see https://stackoverflow.com/questions/48387040/nodejs-recommended-max-old-space-size
RUN NODE_OPTIONS=--max-old-space-size=3584 NODE_ENV=production time npx webpack build
RUN cp nginx.conf /etc/nginx/conf.d/nginx.conf \
    && rm /etc/nginx/sites-enabled/default

# In standard prod these will be overwritten by volume mounts
# Provided here for ease of use in development and
# non-standard deployment environments

RUN mkdir /mnt/ssl \
    && openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /mnt/ssl/nginx.key -out /mnt/ssl/nginx.crt -subj '/countryName=US/stateOrProvinceName=Illinois/localityName=Chicago/organizationName=CDIS/organizationalUnitName=PlanX/commonName=localhost/emailAddress=ops@cdis.org'

CMD bash ./dockerStart.sh
