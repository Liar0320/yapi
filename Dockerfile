FROM node:16-alpine as builder
# 将镜像源替换为阿里云
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
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