# To run: docker run -d --name=dataportal -p 80:80 quay.io/cdis/data-portal
# To check running container: docker exec -it dataportal /bin/bash

FROM quay.io/cdis/nodejs-base:master

ENV REACT_APP_PROJECT_ID=search

# Install nginx
# OpenShift runs containers with an arbitrary UID in the root group (GID 0), so everything
# the process writes must be owned by GID 0 and group-writable. Nothing here may rely on
# capabilities (restricted SCCs drop them all), so nginx runs on unprivileged port 8080.
RUN yum install -y nginx && \
    mkdir -p /tmp/nginx && \
    chgrp -R 0 /tmp/nginx && chmod -R g=u /tmp/nginx && \
    # node lives under /home/gen3/.nvm, so that directory must be traversable by other UIDs
    chmod 711 /home/gen3

# Main nginx config: no `user` directive, pid and temp paths under /tmp, logs to stdout/stderr
COPY nginx-main.conf /etc/nginx/nginx.conf

ARG APP=dev
ARG BASENAME

RUN mkdir -p /data-portal
COPY . /data-portal
RUN cp /data-portal/nginx.conf /etc/nginx/conf.d/nginx.conf \
    && chown -R gen3:0 /etc/nginx/conf.d \
    && chown -R gen3:0 /data-portal \
    && chmod -R g=u /data-portal

# In standard prod these will be overwritten by volume mounts
# Provided here for ease of use in development and
# non-standard deployment environments

RUN mkdir /mnt/ssl \
    && openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /mnt/ssl/nginx.key -out /mnt/ssl/nginx.crt -subj '/countryName=US/stateOrProvinceName=Illinois/localityName=Chicago/organizationName=CDIS/organizationalUnitName=PlanX/commonName=localhost/emailAddress=ops@cdis.org' \
    && chmod 755 /mnt/ssl/nginx.crt \
    && chmod 755 /mnt/ssl/nginx.key

WORKDIR /data-portal
# gen3:0 + umask 002 so build output is group-0 and group-writable
USER gen3:0
RUN umask 002 && COMMIT=`git rev-parse HEAD` && echo "export const portalCommit = \"${COMMIT}\";" >src/versions.js \
    && VERSION=`git describe --always --tags` && echo "export const portalVersion =\"${VERSION}\";" >>src/versions.js \
    && /bin/rm -rf .git \
    && /bin/rm -rf node_modules
RUN umask 002 && npm config set unsafe-perm=true \
    && npm ci \
    && npm run relay \
    && npm run params
    # see https://stackoverflow.com/questions/48387040/nodejs-recommended-max-old-space-size
RUN umask 002 && NODE_OPTIONS=--max-old-space-size=3584 NODE_ENV=production npx webpack build

ENV HOME=/tmp
USER 1000:0

EXPOSE 8080

CMD [ "bash", "./dockerStart.sh" ]
