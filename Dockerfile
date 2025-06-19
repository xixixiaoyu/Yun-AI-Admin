# 多阶段构建 Dockerfile

# 构建阶段
FROM node:18-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
COPY apps/admin/package.json ./apps/admin/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目
RUN pnpm build

# 生产阶段 - 后端
FROM node:18-alpine AS api

# 安装 pnpm
RUN npm install -g pnpm

WORKDIR /app

# 复制后端构建文件和依赖
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/packages/shared/dist ./node_modules/@admin-system/shared/dist
COPY --from=builder /app/packages/shared/package.json ./node_modules/@admin-system/shared/

# 安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 暴露端口
EXPOSE 3333

# 启动命令
CMD ["node", "dist/main.js"]

# 生产阶段 - 前端
FROM nginx:alpine AS admin

# 复制前端构建文件
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动命令
CMD ["nginx", "-g", "daemon off;"]
