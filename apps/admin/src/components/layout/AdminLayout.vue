<template>
  <a-layout class="min-h-screen">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="bg-white shadow-sm"
    >
      <div class="logo p-4 text-center">
        <h1 v-if="!collapsed" class="text-xl font-bold text-primary-600">
          Admin System
        </h1>
        <h1 v-else class="text-xl font-bold text-primary-600">AS</h1>
      </div>
      
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        :inline-collapsed="collapsed"
        class="border-r-0"
      >
        <a-menu-item key="dashboard">
          <template #icon>
            <DashboardOutlined />
          </template>
          <router-link to="/dashboard">仪表盘</router-link>
        </a-menu-item>
        
        <a-sub-menu key="user-management">
          <template #icon>
            <UserOutlined />
          </template>
          <template #title>用户管理</template>
          <a-menu-item key="users">
            <router-link to="/users">用户列表</router-link>
          </a-menu-item>
          <a-menu-item key="roles">
            <router-link to="/roles">角色管理</router-link>
          </a-menu-item>
          <a-menu-item key="permissions">
            <router-link to="/permissions">权限管理</router-link>
          </a-menu-item>
        </a-sub-menu>
        
        <a-sub-menu key="system">
          <template #icon>
            <SettingOutlined />
          </template>
          <template #title>系统设置</template>
          <a-menu-item key="config">
            <router-link to="/system/config">系统配置</router-link>
          </a-menu-item>
          <a-menu-item key="logs">
            <router-link to="/system/logs">操作日志</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    
    <!-- 主内容区 -->
    <a-layout>
      <!-- 顶部导航 -->
      <a-layout-header class="bg-white shadow-sm px-4 flex-between">
        <div class="flex items-center">
          <a-button
            type="text"
            :icon="collapsed ? h(MenuUnfoldOutlined) : h(MenuFoldOutlined)"
            @click="collapsed = !collapsed"
          />
          
          <a-breadcrumb class="ml-4">
            <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              <router-link v-if="item.path" :to="item.path">
                {{ item.name }}
              </router-link>
              <span v-else>{{ item.name }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- 用户信息 -->
          <a-dropdown>
            <a-button type="text" class="flex items-center">
              <a-avatar :src="authStore.user?.avatar" class="mr-2">
                {{ authStore.user?.username?.charAt(0).toUpperCase() }}
              </a-avatar>
              <span>{{ authStore.user?.nickname || authStore.user?.username }}</span>
              <DownOutlined class="ml-1" />
            </a-button>
            
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <router-link to="/profile">
                    <UserOutlined class="mr-2" />
                    个人资料
                  </router-link>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined class="mr-2" />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      
      <!-- 内容区域 -->
      <a-layout-content class="m-6 p-6 bg-white rounded-lg shadow-sm">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 侧边栏状态
const collapsed = ref(false)
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// 面包屑导航
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title)
  return matched.map(item => ({
    name: item.meta?.title as string,
    path: item.path === route.path ? '' : item.path,
  }))
})

// 监听路由变化，更新菜单选中状态
watch(
  () => route.path,
  (path) => {
    if (path.includes('/dashboard')) {
      selectedKeys.value = ['dashboard']
    } else if (path.includes('/users')) {
      selectedKeys.value = ['users']
      openKeys.value = ['user-management']
    } else if (path.includes('/roles')) {
      selectedKeys.value = ['roles']
      openKeys.value = ['user-management']
    } else if (path.includes('/permissions')) {
      selectedKeys.value = ['permissions']
      openKeys.value = ['user-management']
    } else if (path.includes('/system/config')) {
      selectedKeys.value = ['config']
      openKeys.value = ['system']
    } else if (path.includes('/system/logs')) {
      selectedKeys.value = ['logs']
      openKeys.value = ['system']
    }
  },
  { immediate: true }
)

// 退出登录
const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    message.error('退出登录失败')
  }
}
</script>

<style scoped>
.logo {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
}

:deep(.ant-menu) {
  flex: 1;
}
</style>
