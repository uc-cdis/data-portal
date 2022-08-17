FROM quay.io/pcdc/node-lts-alpine:18-alpine
ARG APP=pcdc
ARG BASENAME
RUN apk update \
    && apk upgrade --update-cache --available \
    && apk add bash curl nginx openssl \
    && rm -rf /var/cache/apk/* \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
RUN mkdir -p /data-portal
COPY . /data-portal
WORKDIR /data-portal
RUN npm config set unsafe-perm=true && npm ci --only=production \
    && cp nginx.conf /etc/nginx/http.d/default.conf \
    && mkdir /mnt/ssl \
    && openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /mnt/ssl/nginx.key -out /mnt/ssl/nginx.crt -subj '/countryName=US/stateOrProvinceName=Illinois/localityName=Chicago/organizationName=CDIS/organizationalUnitName=PlanX/commonName=localhost/emailAddress=ops@cdis.org'
CMD bash ./dockerStart.sh
