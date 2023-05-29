FROM node:16.18.1

ARG path=/opt/workspace/portkey-login-page

WORKDIR ${path}

COPY . ${path}

RUN yarn \
    && yarn build 

ENTRYPOINT yarn start

EXPOSE 3000