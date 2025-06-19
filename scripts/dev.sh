#!/bin/bash

# 开发环境启动脚本

echo "🚀 启动开发环境..."

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js 版本需要 >= $REQUIRED_VERSION，当前版本: $NODE_VERSION"
    exit 1
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，请先安装 pnpm"
    echo "npm install -g pnpm"
    exit 1
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    pnpm install
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "📝 创建环境变量文件..."
    cp .env.example .env
    echo "⚠️  请根据实际情况修改 .env 文件中的配置"
fi

# 构建共享包
echo "🔨 构建共享包..."
cd packages/shared && pnpm build && cd ../..

# 启动开发服务器
echo "🌟 启动开发服务器..."
pnpm dev

echo "✅ 开发环境启动完成！"
echo "📚 前端地址: http://localhost:3001"
echo "🔧 后端地址: http://localhost:3333"
echo "📖 API 文档: http://localhost:3333/api/v1/docs"
