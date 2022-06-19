FROM node:16-alpine as builder
WORKDIR /yapi
RUN apk add --no-cache wget python make

# 将工作目录下的文件添加到打包环境中
ADD . vendors/

RUN cd /yapi/vendors && cp config_example.json ../config.json && npm install --production --registry https://registry.npm.taobao.org

FROM node:16-alpine

WORKDIR /yapi/vendors
COPY --from=builder /yapi/vendors /yapi/vendors
EXPOSE 3000
ENTRYPOINT ["node"]