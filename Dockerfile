# To run: docker run -d --name=dataportal -p 80:80 quay.io/cdis/data-portal 
# To check running container: docker exec -it dataportal /bin/bash
 
FROM ubuntu:16.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update

RUN apt-get install -y --no-install-recommends git
RUN apt-get install -y --no-install-recommends vim
RUN apt-get install -y --no-install-recommends curl
RUN apt-get install -y --no-install-recommends nginx
RUN apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup | bash - && \
    apt-get -y install python build-essential nodejs
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN apt-get install -y npm
RUN npm install webpack -g
COPY . /data-portal
WORKDIR /data-portal
RUN npm install
RUN NODE_ENV=production webpack
RUN cp nginx.conf /etc/nginx/conf.d/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
CMD /usr/sbin/nginx -g 'daemon off;'
