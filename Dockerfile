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
    && npm install webpack -g \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

ARG APP=dev
ARG BASENAME

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /data-portal && cp -a /tmp/node_modules /data-portal/

COPY . /data-portal
WORKDIR /data-portal
RUN cp src/img/$APP-favicon.ico src/img/favicon.ico; \
    NODE_ENV=production webpack --bail \
    && cp nginx.conf /etc/nginx/conf.d/nginx.conf \
    && rm /etc/nginx/sites-enabled/default
CMD /usr/sbin/nginx -g 'daemon off;'
