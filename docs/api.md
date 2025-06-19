# API 接口文档

## 概述

本文档描述了后台管理系统的 RESTful API 接口规范。所有 API 接口都遵循统一的响应格式，支持 JSON 数据交换。

## 基础信息

- **Base URL**: `http://localhost:3333/api/v1`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token (JWT)

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "code": 400,
  "timestamp": 1640995200000
}
```

## 认证接口

### 用户登录
- **URL**: `POST /auth/login`
- **描述**: 用户登录获取访问令牌

**请求参数**
```json
{
  "username": "admin",
  "password": "password",
  "remember": false
}
```

**响应数据**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@example.com",
      "avatar": null,
      "nickname": "管理员",
      "roles": ["admin"],
      "permissions": ["user:view", "user:create"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  },
  "message": "登录成功"
}
```

### 用户注册
- **URL**: `POST /auth/register`
- **描述**: 用户注册

**请求参数**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "phone": "13800138000",
  "nickname": "新用户"
}
```

### 刷新令牌
- **URL**: `POST /auth/refresh`
- **描述**: 使用刷新令牌获取新的访问令牌

**请求参数**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 用户登出
- **URL**: `POST /auth/logout`
- **描述**: 用户登出
- **认证**: 需要 Bearer Token

### 获取当前用户信息
- **URL**: `GET /auth/profile`
- **描述**: 获取当前登录用户的详细信息
- **认证**: 需要 Bearer Token

## 用户管理接口

### 获取用户列表
- **URL**: `GET /users`
- **描述**: 分页获取用户列表
- **权限**: `user:view`

**查询参数**
```
page=1&limit=10&keyword=admin&status=active&roleId=1
```

**响应数据**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "1",
        "username": "admin",
        "email": "admin@example.com",
        "nickname": "管理员",
        "status": "active",
        "roles": ["admin"],
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 获取用户详情
- **URL**: `GET /users/:id`
- **描述**: 获取指定用户的详细信息
- **权限**: `user:view`

### 创建用户
- **URL**: `POST /users`
- **描述**: 创建新用户
- **权限**: `user:create`

**请求参数**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "Password123",
  "nickname": "新用户",
  "phone": "13800138000",
  "status": "active",
  "roleIds": ["2"]
}
```

### 更新用户
- **URL**: `PATCH /users/:id`
- **描述**: 更新用户信息
- **权限**: `user:update`

### 删除用户
- **URL**: `DELETE /users/:id`
- **描述**: 删除指定用户
- **权限**: `user:delete`

### 批量删除用户
- **URL**: `POST /users/batch-delete`
- **描述**: 批量删除用户
- **权限**: `user:delete`

**请求参数**
```json
{
  "ids": ["2", "3", "4"]
}
```

### 更新用户状态
- **URL**: `PATCH /users/:id/status`
- **描述**: 更新用户状态
- **权限**: `user:update`

**请求参数**
```json
{
  "status": "inactive"
}
```

### 分配用户角色
- **URL**: `POST /users/:id/roles`
- **描述**: 为用户分配角色
- **权限**: `user:update`

**请求参数**
```json
{
  "roleIds": ["1", "2"]
}
```

## 角色管理接口

### 获取角色列表
- **URL**: `GET /roles`
- **描述**: 分页获取角色列表
- **权限**: `role:view`

**查询参数**
```
page=1&limit=10&keyword=admin&status=active&type=system
```

### 获取角色选项
- **URL**: `GET /roles/options`
- **描述**: 获取角色选项列表（用于下拉选择）
- **权限**: `role:view`

**响应数据**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "超级管理员",
      "code": "super_admin",
      "disabled": true
    },
    {
      "id": "2",
      "name": "管理员",
      "code": "admin",
      "disabled": false
    }
  ]
}
```

### 获取角色详情
- **URL**: `GET /roles/:id`
- **描述**: 获取指定角色的详细信息
- **权限**: `role:view`

### 创建角色
- **URL**: `POST /roles`
- **描述**: 创建新角色
- **权限**: `role:create`

**请求参数**
```json
{
  "name": "编辑员",
  "code": "editor",
  "description": "内容编辑员",
  "type": "custom",
  "status": "active",
  "sort": 3,
  "permissionIds": ["1", "2", "3"]
}
```

### 更新角色
- **URL**: `PATCH /roles/:id`
- **描述**: 更新角色信息
- **权限**: `role:update`

### 删除角色
- **URL**: `DELETE /roles/:id`
- **描述**: 删除指定角色
- **权限**: `role:delete`

### 分配角色权限
- **URL**: `POST /roles/:id/permissions`
- **描述**: 为角色分配权限
- **权限**: `role:update`

**请求参数**
```json
{
  "permissionIds": ["1", "2", "3", "4"]
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 422 | 请求参数验证失败 |
| 500 | 服务器内部错误 |

## 状态码说明

### 用户状态
- `active`: 正常
- `inactive`: 禁用
- `banned`: 封禁
- `pending`: 待激活

### 角色状态
- `active`: 启用
- `inactive`: 禁用

### 角色类型
- `system`: 系统角色
- `custom`: 自定义角色

## 认证说明

### Bearer Token 认证
在请求头中添加 Authorization 字段：
```
Authorization: Bearer <access_token>
```

### Token 过期处理
- 访问令牌过期时间：15分钟
- 刷新令牌过期时间：7天
- 当访问令牌过期时，使用刷新令牌获取新的访问令牌

## 限流说明

为了保护 API 服务，系统实施了请求限流：
- 默认限制：每分钟 60 次请求
- 登录接口：每分钟 10 次请求
- 超出限制时返回 429 状态码

## 在线文档

访问 Swagger 在线文档：`http://localhost:3333/api/v1/docs`
