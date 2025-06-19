<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">仪表盘</h1>
      <p class="text-gray-600 mt-1">欢迎回来，{{ authStore.user?.nickname || authStore.user?.username }}！</p>
    </div>
    
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card card-body">
        <div class="flex-between">
          <div>
            <p class="text-sm text-gray-600">总用户数</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">1,234</p>
            <p class="text-sm text-green-600 mt-1">
              <span class="i-ant-design:arrow-up-outlined mr-1"></span>
              +12% 较上月
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex-center">
            <span class="i-ant-design:user-outlined text-xl text-blue-600"></span>
          </div>
        </div>
      </div>
      
      <div class="card card-body">
        <div class="flex-between">
          <div>
            <p class="text-sm text-gray-600">活跃用户</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">856</p>
            <p class="text-sm text-green-600 mt-1">
              <span class="i-ant-design:arrow-up-outlined mr-1"></span>
              +8% 较上月
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex-center">
            <span class="i-ant-design:team-outlined text-xl text-green-600"></span>
          </div>
        </div>
      </div>
      
      <div class="card card-body">
        <div class="flex-between">
          <div>
            <p class="text-sm text-gray-600">今日访问</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">2,468</p>
            <p class="text-sm text-red-600 mt-1">
              <span class="i-ant-design:arrow-down-outlined mr-1"></span>
              -3% 较昨日
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex-center">
            <span class="i-ant-design:eye-outlined text-xl text-orange-600"></span>
          </div>
        </div>
      </div>
      
      <div class="card card-body">
        <div class="flex-between">
          <div>
            <p class="text-sm text-gray-600">系统状态</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">正常</p>
            <p class="text-sm text-green-600 mt-1">
              <span class="i-ant-design:check-circle-outlined mr-1"></span>
              运行稳定
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex-center">
            <span class="i-ant-design:setting-outlined text-xl text-purple-600"></span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图表和表格 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 访问趋势图 -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold">访问趋势</h3>
        </div>
        <div class="card-body">
          <div class="h-64 flex-center bg-gray-50 rounded">
            <p class="text-gray-500">图表组件待实现</p>
          </div>
        </div>
      </div>
      
      <!-- 最近活动 -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold">最近活动</h3>
        </div>
        <div class="card-body">
          <a-list :data-source="recentActivities" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar :src="item.avatar">{{ item.user.charAt(0) }}</a-avatar>
                  </template>
                  <template #title>
                    <span>{{ item.user }}</span>
                  </template>
                  <template #description>
                    <span>{{ item.action }}</span>
                    <span class="text-gray-400 ml-2">{{ item.time }}</span>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 最近活动数据
const recentActivities = ref([
  {
    user: '张三',
    action: '登录系统',
    time: '2 分钟前',
    avatar: '',
  },
  {
    user: '李四',
    action: '创建了新用户',
    time: '5 分钟前',
    avatar: '',
  },
  {
    user: '王五',
    action: '修改了角色权限',
    time: '10 分钟前',
    avatar: '',
  },
  {
    user: '赵六',
    action: '导出了用户数据',
    time: '15 分钟前',
    avatar: '',
  },
  {
    user: '钱七',
    action: '更新了系统配置',
    time: '20 分钟前',
    avatar: '',
  },
])
</script>

<style scoped>
:deep(.ant-list-item-meta-title) {
  margin-bottom: 0;
}

:deep(.ant-list-item-meta-description) {
  font-size: 12px;
}
</style>
