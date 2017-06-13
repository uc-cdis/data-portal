# To run: docker run -d --name=dataportal -p 80:80 quay.io/cdis/data-portal 
# To check running container: docker exec -it dataportal /bin/bash
 
FROM ubuntu:16.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    nginx \
    nodejs \
    npm \
    python \
    vim \
    && curl -sL https://deb.nodesource.com/setup | bash - \ 
    && ln -s /usr/bin/nodejs /usr/bin/node \
    && npm install webpack -g \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

COPY . /data-portal
WORKDIR /data-portal
RUN npm install \
    && NODE_ENV=production webpack \
    && cp nginx.conf /etc/nginx/conf.d/nginx.conf \
    && rm /etc/nginx/sites-enabled/default
CMD /usr/sbin/nginx -g 'daemon off;'
