# To run: docker run -d -v /path/to/local_settings.py:/var/www/user-api/local_settings.py --name=user-api -p 80:80 user-api
# To check running container: docker exec -it user-api /bin/bash
 
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
WORKDIR /data-portal
COPY . /data-portal
RUN npm install
RUN NODE_ENV=production webpack
