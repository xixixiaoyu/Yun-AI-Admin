#!/bin/bash

# 生产环境构建脚本

echo "🏗️ 开始构建生产版本..."

# 清理旧的构建文件
echo "🧹 清理旧的构建文件..."
pnpm clean

# 安装依赖
echo "📦 安装依赖..."
pnpm install --frozen-lockfile

# 代码检查
echo "🔍 代码检查..."
pnpm lint

# 构建共享包
echo "🔨 构建共享包..."
cd packages/shared && pnpm build && cd ../..

# 构建后端
echo "🔧 构建后端..."
cd apps/api && pnpm build && cd ../..

# 构建前端
echo "🎨 构建前端..."
cd apps/admin && pnpm build && cd ../..

echo "✅ 构建完成！"
echo "📁 后端构建文件: apps/api/dist"
echo "📁 前端构建文件: apps/admin/dist"
