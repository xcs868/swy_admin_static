FROM node:20.16.0-slim AS BUILD

WORKDIR ./
RUN pwd && ls -al
COPY ./ /usr/app

WORKDIR /usr/app
RUN pwd && ls -al


RUN node -v && npm -v
RUN npm install
RUN ls -al /usr/app
RUN npm run build:development
RUN npm run generate:version
RUN pwd && ls -al

FROM registry.cn-shanghai.aliyuncs.com/dt_work/nginx:v1.21 AS FINAL

COPY --from=BUILD /usr/app/dist/ /var/www/html

COPY ./k8s/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

WORKDIR /var/www/html

RUN pwd && du -sh && ls -al
