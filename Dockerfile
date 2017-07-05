FROM node:8.1.2

EXPOSE 8080

RUN mkdir -p /usr/src/proxy
WORKDIR /usr/src/proxy

COPY package.json /usr/src/proxy/
COPY config.js /usr/src/proxy/
COPY getCache.js /usr/src/proxy/
COPY getProxiedServerData.js /usr/src/proxy/
COPY index.js /usr/src/proxy/

RUN npm install

VOLUME /usr/src/proxy