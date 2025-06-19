import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
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
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: {
        title: '注册',
        requiresAuth: false,
      },
    },
    {
      path: '/',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: {
        requiresAuth: true,
      },
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
        {
          path: 'roles',
          name: 'roles',
          component: () => import('@/views/role/RoleListView.vue'),
          meta: {
            title: '角色管理',
            requiresAuth: true,
            permissions: ['role:view'],
          },
        },
        {
          path: 'permissions',
          name: 'permissions',
          component: () => import('@/views/permission/PermissionListView.vue'),
          meta: {
            title: '权限管理',
            requiresAuth: true,
            permissions: ['permission:view'],
          },
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/user/ProfileView.vue'),
          meta: {
            title: '个人资料',
            requiresAuth: true,
          },
        },
        {
          path: 'system/config',
          name: 'system-config',
          component: () => import('@/views/system/ConfigView.vue'),
          meta: {
            title: '系统配置',
            requiresAuth: true,
            permissions: ['system:config'],
          },
        },
        {
          path: 'system/logs',
          name: 'system-logs',
          component: () => import('@/views/system/LogView.vue'),
          meta: {
            title: '操作日志',
            requiresAuth: true,
            permissions: ['system:log'],
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/error/NotFoundView.vue'),
      meta: {
        title: '页面不存在',
      },
    },
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 如果需要认证但用户未登录，跳转到登录页
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
    return
  }

  // 如果已登录但访问登录页，跳转到仪表盘
  if (authStore.isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    next('/dashboard')
    return
  }

  // 检查权限
  if (to.meta.permissions && Array.isArray(to.meta.permissions)) {
    const hasPermission = authStore.hasAnyPermission(to.meta.permissions as string[])
    if (!hasPermission) {
      // 可以跳转到无权限页面或显示错误信息
      next('/dashboard')
      return
    }
  }

  next()
})

export default router
