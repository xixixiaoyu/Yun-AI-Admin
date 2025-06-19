# 前端开发指南

## 概述

本文档详细介绍了前端项目的开发规范、技术栈使用方法和最佳实践。

## 技术栈

### 核心框架
- **Vue 3**: 采用 Composition API 开发模式
- **TypeScript**: 提供类型安全和更好的开发体验
- **Vite**: 快速的开发构建工具

### UI 和样式
- **Ant Design Vue**: 企业级 UI 组件库
- **UnoCSS**: 原子化 CSS 引擎
- **响应式设计**: 支持多种设备尺寸

### 状态管理和路由
- **Pinia**: 轻量级状态管理
- **Vue Router 4**: 官方路由管理器

### 工具库
- **Axios**: HTTP 客户端
- **Day.js**: 日期处理库

## 项目结构

```
apps/admin/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口定义
│   │   ├── auth.ts        # 认证相关接口
│   │   ├── user.ts        # 用户管理接口
│   │   └── role.ts        # 角色管理接口
│   ├── components/        # 可复用组件
│   │   ├── common/        # 通用组件
│   │   └── layout/        # 布局组件
│   ├── stores/            # Pinia 状态管理
│   │   ├── auth.ts        # 认证状态
│   │   └── user.ts        # 用户状态
│   ├── utils/             # 工具函数
│   │   ├── request.ts     # HTTP 请求封装
│   │   └── format.ts      # 格式化工具
│   ├── views/             # 页面组件
│   │   ├── auth/          # 认证页面
│   │   ├── dashboard/     # 仪表盘
│   │   ├── user/          # 用户管理
│   │   └── system/        # 系统设置
│   ├── router/            # 路由配置
│   ├── types/             # 类型定义
│   ├── App.vue            # 根组件
│   └── main.ts            # 应用入口
├── index.html             # HTML 模板
├── vite.config.ts         # Vite 配置
├── uno.config.ts          # UnoCSS 配置
└── package.json           # 依赖配置
```

## 开发规范

### 组件开发

#### 1. 组件命名
- 使用 PascalCase 命名组件文件
- 组件名应该具有描述性

```typescript
// ✅ 好的命名
UserListView.vue
CreateUserModal.vue
UserStatusTag.vue

// ❌ 避免的命名
List.vue
Modal.vue
Tag.vue
```

#### 2. 组件结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 导入
import { ref, reactive, onMounted } from 'vue'
import type { User } from '@admin-system/shared'

// 类型定义
interface Props {
  userId: string
}

// Props 和 Emits
const props = defineProps<Props>()
const emit = defineEmits<{
  update: [user: User]
}>()

// 响应式数据
const loading = ref(false)
const formData = reactive({
  name: '',
  email: '',
})

// 计算属性
const isValid = computed(() => {
  return formData.name && formData.email
})

// 方法
const handleSubmit = async () => {
  // 处理逻辑
}

// 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
/* 组件样式 */
</style>
```

#### 3. Props 和 Emits 定义
```typescript
// Props 定义
interface Props {
  user: User
  readonly?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  size: 'medium',
})

// Emits 定义
const emit = defineEmits<{
  update: [user: User]
  delete: [id: string]
  'status-change': [id: string, status: UserStatus]
}>()
```

### 状态管理

#### 1. Pinia Store 结构
```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@admin-system/shared'
import * as userApi from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const users = ref<User[]>([])
  const loading = ref(false)
  const currentUser = ref<User | null>(null)

  // 计算属性
  const activeUsers = computed(() => 
    users.value.filter(user => user.status === 'active')
  )

  // 方法
  const fetchUsers = async () => {
    try {
      loading.value = true
      const response = await userApi.getUserList()
      if (response.success) {
        users.value = response.data.users
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: CreateUserDto) => {
    const response = await userApi.createUser(userData)
    if (response.success) {
      users.value.push(response.data)
    }
    return response
  }

  return {
    // 状态
    users,
    loading,
    currentUser,
    
    // 计算属性
    activeUsers,
    
    // 方法
    fetchUsers,
    createUser,
  }
})
```

#### 2. Store 使用
```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 访问状态
const users = userStore.users
const loading = userStore.loading

// 调用方法
const handleCreateUser = async (userData) => {
  await userStore.createUser(userData)
}

// 使用计算属性
const activeUserCount = userStore.activeUsers.length
</script>
```

### API 接口调用

#### 1. HTTP 请求封装
```typescript
// utils/request.ts
import axios from 'axios'
import { message } from 'ant-design-vue'
import type { ApiResponse } from '@admin-system/shared'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.success === false) {
      message.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message))
    }
    return data
  },
  (error) => {
    // 错误处理
    return Promise.reject(error)
  }
)

export const http = {
  get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    return request.get(url, config)
  },
  
  post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return request.post(url, data, config)
  },
  
  // 其他方法...
}
```

#### 2. API 接口定义
```typescript
// api/user.ts
import { http } from '@/utils/request'
import type { User, CreateUserDto, UserListResponse } from '@admin-system/shared'

export function getUserList(params: any) {
  return http.get<UserListResponse>('/v1/users', { params })
}

export function createUser(data: CreateUserDto) {
  return http.post<User>('/v1/users', data)
}

export function updateUser(id: string, data: Partial<User>) {
  return http.patch<User>(`/v1/users/${id}`, data)
}
```

### 路由管理

#### 1. 路由配置
```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: {
        title: '登录',
        requiresAuth: false,
      },
    },
    {
      path: '/',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: {
            title: '仪表盘',
            requiresAuth: true,
          },
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/user/UserListView.vue'),
          meta: {
            title: '用户管理',
            requiresAuth: true,
            permissions: ['user:view'],
          },
        },
      ],
    },
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
    return
  }
  
  if (to.meta.permissions) {
    const hasPermission = authStore.hasAnyPermission(to.meta.permissions as string[])
    if (!hasPermission) {
      next('/dashboard')
      return
    }
  }
  
  next()
})

export default router
```

### 样式开发

#### 1. UnoCSS 使用
```vue
<template>
  <!-- 使用原子化类名 -->
  <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
    <h1 class="text-2xl font-bold text-gray-900">标题</h1>
    <button class="btn-primary">按钮</button>
  </div>
</template>
```

#### 2. 自定义样式
```vue
<style scoped>
.custom-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.custom-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors;
}
</style>
```

### 表单处理

#### 1. 表单验证
```vue
<template>
  <a-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    layout="vertical"
    @finish="handleSubmit"
  >
    <a-form-item label="用户名" name="username">
      <a-input v-model:value="formData.username" />
    </a-form-item>
    
    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="formData.email" />
    </a-form-item>
    
    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="loading">
        提交
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'ant-design-vue'

const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  username: '',
  email: '',
})

const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    // 提交逻辑
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

### 错误处理

#### 1. 全局错误处理
```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err, info)
  // 发送错误报告
}

// 未捕获的 Promise 错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('未捕获的 Promise 错误:', event.reason)
  event.preventDefault()
})
```

#### 2. 组件错误边界
```vue
<template>
  <div v-if="error" class="error-boundary">
    <h2>出现错误</h2>
    <p>{{ error.message }}</p>
    <button @click="retry">重试</button>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
  return false
})

const retry = () => {
  error.value = null
}
</script>
```

## 性能优化

### 1. 路由懒加载
```typescript
const routes = [
  {
    path: '/users',
    component: () => import('@/views/user/UserListView.vue'),
  },
]
```

### 2. 组件懒加载
```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent(() => import('./HeavyComponent.vue'))
</script>
```

### 3. 虚拟滚动
```vue
<template>
  <a-virtual-list
    :data="largeDataList"
    :height="400"
    :item-height="50"
  >
    <template #item="{ item }">
      <div>{{ item.name }}</div>
    </template>
  </a-virtual-list>
</template>
```

## 测试

### 1. 单元测试
```typescript
// tests/components/UserCard.test.ts
import { mount } from '@vue/test-utils'
import UserCard from '@/components/UserCard.vue'

describe('UserCard', () => {
  it('renders user information correctly', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    }
    
    const wrapper = mount(UserCard, {
      props: { user },
    })
    
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john@example.com')
  })
})
```

### 2. E2E 测试
```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')
  
  await page.fill('[data-testid="username"]', 'admin')
  await page.fill('[data-testid="password"]', 'password')
  await page.click('[data-testid="login-button"]')
  
  await expect(page).toHaveURL('/dashboard')
})
```

## 调试技巧

### 1. Vue DevTools
- 安装 Vue DevTools 浏览器扩展
- 使用组件检查器查看组件状态
- 使用 Pinia 插件调试状态变化

### 2. 网络调试
```typescript
// 在开发环境中启用请求日志
if (import.meta.env.DEV) {
  request.interceptors.request.use((config) => {
    console.log('请求:', config)
    return config
  })
  
  request.interceptors.response.use((response) => {
    console.log('响应:', response)
    return response
  })
}
```

### 3. 性能分析
```typescript
// 使用 Performance API
const start = performance.now()
// 执行操作
const end = performance.now()
console.log(`操作耗时: ${end - start}ms`)
```
