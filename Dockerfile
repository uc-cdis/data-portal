# To run: docker run -d --name=dataportal -p 80:80 quay.io/cdis/data-portal 
# To check running container: docker exec -it dataportal /bin/bash
 
FROM ubuntu:16.04

ENV DEBIAN_FRONTEND=noninteractive
ARG APP=dev
ARG BASENAME

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    nginx \
    python \
    vim \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \ 
    && apt-get install -y --no-install-recommends nodejs npm\
    && ln -s /usr/bin/nodejs /usr/bin/node \
    && npm install webpack -g \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

COPY . /data-portal
WORKDIR /data-portal
RUN cp $APP-index.html index.html; \
    cp src/img/$APP-favicon.ico src/img/favicon.ico; \
    npm install \
    && NODE_ENV=production webpack \
    && cp nginx.conf /etc/nginx/conf.d/nginx.conf \
    && rm /etc/nginx/sites-enabled/default
CMD /usr/sbin/nginx -g 'daemon off;'
