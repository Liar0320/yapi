# https://github.com/docker-library/docs
# Docker —— 从入门到实践 https://yeasy.gitbook.io/docker_practice/image/dockerfile/references
# docker-部署前端 https://q.shanyue.tech/engineering/749.html#%E4%BD%BF%E7%94%A8-docker-%E9%83%A8%E7%BD%B2%E5%89%8D%E7%AB%AF
# Why can't I use Docker CMD multiple times to run multiple services? https://github.com/sass/node-sass/issues/2165#issuecomment-440999165
# node-sass missing binding error  https://github.com/sass/node-sass/issues/2165#issuecomment-346971541  https://github.com/sass/node-sass/issues/2165#issuecomment-347043659

############ 打包环境制作阶段

# 指定 node 版本号，满足宿主环境
FROM node:16-alpine as builder

# 指定工作目录，将代码添加至此
WORKDIR /client

ADD package.json .npmrc yarn.lock /client/

# 安装项目依赖
RUN yarn install
# # 解决
# RUN npm rebuild node-sass

# # 解决确实 python环境 from https://github.com/nodejs/docker-node/issues/384#issuecomment-748778725
# RUN apk --no-cache add --virtual native-deps \
#     g++ gcc libgcc libstdc++ linux-headers make python2 && \
#     npm install --quiet node-gyp -g

# 将所有的文件添加到 工作目录
# 之前没有一起传输 是做一步docker缓存
ADD . /client/

# 执行打包命令
RUN npm run build


# 暴露出运行的端口号，可对外接入服务发现
# EXPOSE 3000

############ 生产镜像制作阶段
# 选择更小体积的基础镜像
FROM nginx:alpine

# 将构建产物移至 nginx 中
COPY --from=builder client/dist/ /usr/share/nginx/html/

# slove 2
# # Add Python per https://github.com/nodejs/docker-node/issues/384
# # https://github.com/nodejs/docker-node/issues/282
# # --no-cache: download package index on-the-fly, no need to cleanup afterwards
# # --virtual: bundle packages, remove whole bundle at once, when done
# RUN apk add --no-cache --virtual build-dependencies \
#     python2 \
#     python3 \
#     make \
#     g++ \
#     && npm install \
#     && apk del build-dependencies