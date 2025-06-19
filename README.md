# Admin System

基于 Vue 3 + NestJS 的现代化后台管理系统，采用 pnpm monorepo 架构。

## 🏗️ 项目架构

```
admin-system/
├── apps/
│   ├── admin/          # 前端管理界面 (Vue 3)
│   └── api/            # 后端 API 服务 (NestJS)
├── packages/
│   └── shared/         # 共享类型定义
├── package.json        # 根配置文件
└── pnpm-workspace.yaml # pnpm workspace 配置
```

## 🚀 技术栈

### 前端 (Vue 3 生态)
- **框架**: Vue 3 + TypeScript + Vite
- **UI 库**: Ant Design Vue
- **样式**: UnoCSS (原子化 CSS)
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **HTTP 客户端**: Axios

### 后端 (Node.js 生态)
- **框架**: NestJS + TypeScript
- **认证**: JWT (访问令牌 + 刷新令牌)
- **数据库**: PostgreSQL
- **缓存**: Redis
- **API 文档**: Swagger

### 开发工具
- **包管理**: pnpm
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript

## 📦 核心功能

- ✅ 用户认证系统 (注册/登录/密码重置)
- ✅ 基于角色的权限控制 (RBAC)
- ✅ 用户管理
- ✅ 角色管理
- ✅ 权限配置
- ✅ 响应式管理界面
- ✅ API 接口文档

## 🛠️ 开发指南

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 13
- Redis >= 6

### 快速开始

1. **安装依赖**
   ```bash
   pnpm install
   ```

2. **启动开发环境**
   ```bash
   pnpm dev
   ```

3. **构建项目**
   ```bash
   pnpm build
   ```

### 开发命令

```bash
# 安装依赖
pnpm install

# 启动所有应用的开发服务器
pnpm dev

# 构建所有应用
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 运行测试
pnpm test

# 清理构建文件
pnpm clean
```

## 📚 文档

- [项目架构说明](./docs/architecture.md)
- [API 接口文档](./docs/api.md)
- [前端开发指南](./docs/frontend.md)
- [后端开发指南](./docs/backend.md)
- [部署指南](./docs/deployment.md)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
