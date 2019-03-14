FROM node:10.15.3
MAINTAINER zfeng <i@zfeng.net>

ENV VERSION 0.0.1

WORKDIR /app

ADD . ./
RUN npm install yarn -g
RUN rm -rf dist node_modules
RUN yarn
RUN npm run build
RUN yarn install

RUN mkdir -p dist/configs
RUN cp -r src/views dist
RUN cp -r src/public dist
RUN rm -rf src logs

ENV NODE_ENV production

VOLUME /app/dist/configs

CMD ["npm", "run", "start:prod"]

EXPOSE 3000
