<template>
  <div class="min-h-screen flex-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="w-full max-w-md">
      <div class="card p-8">
        <!-- Logo 和标题 -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin System</h1>
          <p class="text-gray-600">后台管理系统</p>
        </div>

        <!-- 登录表单 -->
        <a-form :model="formData" :rules="rules" @finish="handleSubmit" layout="vertical">
          <a-form-item label="用户名" name="username">
            <a-input
              v-model:value="formData.username"
              size="large"
              placeholder="请输入用户名"
              :prefix="h(UserOutlined)"
            />
          </a-form-item>

          <a-form-item label="密码" name="password">
            <a-input-password
              v-model:value="formData.password"
              size="large"
              placeholder="请输入密码"
              :prefix="h(LockOutlined)"
            />
          </a-form-item>

          <a-form-item>
            <div class="flex-between">
              <a-checkbox v-model:checked="formData.remember"> 记住登录状态 </a-checkbox>
              <a-button type="link" class="p-0"> 忘记密码？ </a-button>
            </div>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              block
              :loading="authStore.loading"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>

        <!-- 注册链接 -->
        <div class="text-center mt-6">
          <span class="text-gray-600">还没有账号？</span>
          <router-link to="/register" class="text-primary-600 hover:text-primary-700 ml-1">
            立即注册
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, h, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import type { LoginDto } from '@admin-system/shared'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const formData = reactive<LoginDto>({
  username: '',
  password: '',
  remember: false,
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 个字符', trigger: 'blur' },
  ],
}

// 提交登录
const handleSubmit = async () => {
  try {
    const success = await authStore.login(formData)
    if (success) {
      // 等待状态更新完成后再跳转
      await nextTick()
      // 登录成功，跳转到仪表盘
      router.push('/dashboard')
    }
  } catch (error) {
    message.error('登录失败，请检查用户名和密码')
  }
}
</script>

<style scoped>
:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
}

:deep(.ant-btn) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.ant-checkbox-wrapper) {
  font-size: 14px;
}
</style>
