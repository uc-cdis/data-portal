# To run: docker run -d --name=dataportal -p 80:80 quay.io/cdis/data-portal
# To check running container: docker exec -it dataportal /bin/bash

FROM quay.io/cdis/nodejs-base:master

ENV REACT_APP_PROJECT_ID=search

# Install nginx
RUN yum install nginx -y && \
    # allows nginx to run on port 80 without being root user
    setcap 'cap_net_bind_service=+ep' /usr/sbin/nginx && \
    chown -R gen3:gen3 /var/log/nginx && \
    # pipe nginx logs to stdout/stderr
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log && \
    mkdir -p /var/lib/nginx/tmp/client_body && \
    chown -R gen3:gen3 /var/lib/nginx/ && \
    mkdir -p /var/cache/nginx && \
    chown -R gen3:gen3 /var/cache/nginx \
    && touch /var/run/nginx.pid \
    && chown -R gen3:gen3 /var/run/nginx.pid

ARG APP=dev
ARG BASENAME

RUN mkdir -p /data-portal
COPY . /data-portal
RUN cp /data-portal/nginx.conf /etc/nginx/conf.d/nginx.conf \
    && chown -R gen3:gen3 /etc/nginx/conf.d \
    && chown -R gen3:gen3 /data-portal

# In standard prod these will be overwritten by volume mounts
# Provided here for ease of use in development and
# non-standard deployment environments

RUN mkdir /mnt/ssl \
    && openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /mnt/ssl/nginx.key -out /mnt/ssl/nginx.crt -subj '/countryName=US/stateOrProvinceName=Illinois/localityName=Chicago/organizationName=CDIS/organizationalUnitName=PlanX/commonName=localhost/emailAddress=ops@cdis.org' \
    && chmod 755 /mnt/ssl/nginx.crt \
    && chmod 755 /mnt/ssl/nginx.key

WORKDIR /data-portal
USER gen3
RUN COMMIT=`git rev-parse HEAD` && echo "export const portalCommit = \"${COMMIT}\";" >src/versions.js \
    && VERSION=`git describe --always --tags` && echo "export const portalVersion =\"${VERSION}\";" >>src/versions.js \
    && /bin/rm -rf .git \
    && /bin/rm -rf node_modules
RUN npm config set unsafe-perm=true \
    && npm ci \
    && npm run relay \
    && npm run params
    # see https://stackoverflow.com/questions/48387040/nodejs-recommended-max-old-space-size
RUN NODE_OPTIONS=--max-old-space-size=3584 NODE_ENV=production npx webpack build

CMD [ "bash", "./dockerStart.sh" ]
