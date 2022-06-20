# description:
# 方案比较
# 方案一
#   优点: 1. 打包放在docker容器中打包
#   缺点: 1. 在打包编译阶段 需要先 安装开发环境的依赖。 打包完成后， 切换到 生产环境的依赖
# 方案二
#   优点: 1. 在打包编译阶段 不需要切换环境， 提高打包效率 ，高效运用缓存
#   缺点: 1. 打包放在本地 自动化构建感觉缺了最关键的一步

# 两种方案：在安装依赖时都为他生成了一个 依赖安装阶段的原因是
#          在yarn 安装第三包是 会产生缓存文件， 加大了 镜像的体积

########### 基础环境
# 指定 node 版本号，满足宿主环境
FROM node:14-alpine as base

# 设置环境变量
ENV NODE_ENV=production \
    APP_PATH=/yapi

# 设置工作目录
WORKDIR $APP_PATH

# # 安装 nodejs 和 yarn        
# # 包源 https://pkgs.alpinelinux.org/packages
# RUN apk add --no-cache nodejs yarn

# 使用阿里云的镜像，替换掉 Linux 默认的镜像，达到加速的效果 
# @see https://www.dandelioncloud.cn/article/details/1486748781877252097
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 解决确实 python环境 from https://github.com/nodejs/docker-node/issues/384#issuecomment-748778725
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers make python2 && \
    npm install --quiet node-gyp -g

############ 打包编译环境
# 使用基础镜像装依赖阶段
FROM base AS builder

# 拷贝 package.json  yarn.lock  到工作跟目录下
ADD package.json .npmrc yarn.lock $APP_PATH/core/

# 安装打包环境依赖
RUN cd $APP_PATH/core && yarn install --production=false

# 将工作目录下的文件添加到打包环境中
ADD . $APP_PATH/core

RUN cp $APP_PATH/core/config_example.json $APP_PATH/config.json
# # COPY $APP_PATH/core/config_example.json $APP_PATH/config.json

# 执行打包
RUN cd $APP_PATH/core && yarn run build-client

# 重新安装 生产环境的包
RUN cd $APP_PATH/core && rm -rf node_modules && yarn install --production=true

# ############ 生产环境
# 使用基础镜像作为生产环境
FROM node:14-alpine AS prod

# 设置环境变量
ENV NODE_ENV=production \
    APP_PATH=/yapi

# 设置工作目录
WORKDIR $APP_PATH

# 将构建产物移至 nginx 中cd 
COPY --from=builder $APP_PATH/core $APP_PATH/core

COPY --from=builder $APP_PATH/core/config_example.json $APP_PATH/config.json

EXPOSE 3000

ENTRYPOINT ["node"]


# # # 切换第三方包 为 生产环境
# # RUN yarn install --production=true --force

# # # 直接运行 不进行 文件体积 缩小
# # RUN yarn run start
