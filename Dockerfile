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
ENV APP_PATH=/node/app

# 设置工作目录
WORKDIR $APP_PATH/core

# 拷贝 package.json  yarn.lock  到工作跟目录下
ADD package.json .npmrc yarn.lock $APP_PATH/core/

# 安装打包环境依赖
RUN yarn install --production=true

# 将工作目录下的文件添加到打包环境中
ADD . $APP_PATH/core/

EXPOSE 3000

ENTRYPOINT ["node"]
