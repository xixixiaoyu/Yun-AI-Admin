# 项目架构说明

## 概述

本项目是一个基于现代化技术栈的后台管理系统，采用 pnpm monorepo 架构，前后端分离设计，支持完整的用户认证和权限管理功能。

## 技术架构

### 整体架构

```
admin-system/
├── apps/                    # 应用程序
│   ├── admin/              # 前端管理界面 (Vue 3)
│   └── api/                # 后端 API 服务 (NestJS)
├── packages/               # 共享包
│   └── shared/             # 共享类型定义和工具
├── scripts/                # 构建和部署脚本
├── docs/                   # 项目文档
└── docker-compose.yml      # Docker 容器编排
```

### 前端架构 (Vue 3 生态)

**核心技术栈**
- **Vue 3**: 渐进式 JavaScript 框架
- **TypeScript**: 类型安全的 JavaScript 超集
- **Vite**: 快速的前端构建工具
- **Vue Router 4**: 官方路由管理器
- **Pinia**: 轻量级状态管理库
- **Ant Design Vue**: 企业级 UI 组件库
- **UnoCSS**: 原子化 CSS 引擎

**目录结构**
```
apps/admin/
├── src/
│   ├── api/                # API 接口定义
│   ├── components/         # 可复用组件
│   │   ├── common/         # 通用组件
│   │   └── layout/         # 布局组件
│   ├── stores/             # Pinia 状态管理
│   ├── utils/              # 工具函数
│   ├── views/              # 页面组件
│   │   ├── auth/           # 认证相关页面
│   │   ├── dashboard/      # 仪表盘
│   │   ├── user/           # 用户管理
│   │   ├── role/           # 角色管理
│   │   └── system/         # 系统设置
│   ├── router/             # 路由配置
│   └── main.ts             # 应用入口
├── public/                 # 静态资源
└── vite.config.ts          # Vite 配置
```

### 后端架构 (NestJS 生态)

**核心技术栈**
- **NestJS**: 渐进式 Node.js 框架
- **TypeScript**: 类型安全开发
- **JWT**: JSON Web Token 认证
- **Passport**: 认证中间件
- **Swagger**: API 文档生成
- **TypeORM**: 对象关系映射 (ORM)
- **PostgreSQL**: 关系型数据库
- **Redis**: 内存数据库 (缓存)

**目录结构**
```
apps/api/
├── src/
│   ├── modules/            # 业务模块
│   │   ├── auth/           # 认证模块
│   │   ├── user/           # 用户管理
│   │   ├── role/           # 角色管理
│   │   └── permission/     # 权限管理
│   ├── common/             # 公共模块
│   │   ├── decorators/     # 装饰器
│   │   ├── filters/        # 异常过滤器
│   │   ├── guards/         # 守卫
│   │   ├── interceptors/   # 拦截器
│   │   └── pipes/          # 管道
│   ├── config/             # 配置文件
│   ├── database/           # 数据库相关
│   │   ├── entities/       # 实体定义
│   │   └── migrations/     # 数据库迁移
│   └── main.ts             # 应用入口
└── nest-cli.json           # NestJS CLI 配置
```

## 核心功能模块

### 1. 用户认证系统

**功能特性**
- 用户注册/登录
- JWT Token 认证
- 刷新令牌机制
- 密码加密存储
- 登录状态管理

**技术实现**
- 使用 Passport.js 实现多种认证策略
- JWT 访问令牌 (15分钟) + 刷新令牌 (7天)
- bcryptjs 密码加密
- 前端 Pinia 状态管理

### 2. 权限管理系统 (RBAC)

**功能特性**
- 基于角色的访问控制
- 用户角色分配
- 权限资源管理
- 路由级权限控制
- API 级权限验证

**技术实现**
- 自定义权限装饰器和守卫
- 前端路由守卫
- 动态菜单生成
- 权限继承机制

### 3. 用户管理

**功能特性**
- 用户 CRUD 操作
- 批量操作支持
- 用户状态管理
- 角色分配
- 搜索和筛选

**技术实现**
- RESTful API 设计
- 分页查询优化
- 表单验证
- 实时数据更新

## 数据流架构

### 前端数据流

```
用户操作 → Vue 组件 → Pinia Store → API 调用 → 后端服务
    ↓
UI 更新 ← 状态更新 ← 响应处理 ← HTTP 响应 ← 数据处理
```

### 后端数据流

```
HTTP 请求 → 路由 → 控制器 → 服务层 → 数据访问层 → 数据库
     ↓
HTTP 响应 ← 响应格式化 ← 业务逻辑 ← 数据处理 ← 查询结果
```

## 安全架构

### 认证安全
- JWT Token 机制
- 刷新令牌轮换
- 密码强度验证
- 登录失败限制

### 授权安全
- 基于角色的访问控制
- 细粒度权限控制
- API 权限验证
- 前端路由守卫

### 数据安全
- 密码加密存储
- SQL 注入防护
- XSS 攻击防护
- CSRF 保护

## 性能优化

### 前端优化
- 路由懒加载
- 组件按需加载
- 静态资源压缩
- CDN 加速

### 后端优化
- 数据库索引优化
- Redis 缓存策略
- API 响应压缩
- 连接池管理

## 可扩展性设计

### 模块化设计
- 前后端模块化架构
- 插件化扩展机制
- 微服务友好设计

### 配置管理
- 环境变量配置
- 动态配置更新
- 多环境支持

### 监控和日志
- 应用性能监控
- 错误日志收集
- 用户行为分析
