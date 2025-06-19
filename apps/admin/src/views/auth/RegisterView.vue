<template>
  <div
    class="min-h-screen flex-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
      ></div>
    </div>

    <div class="w-full max-w-md mx-4 relative z-10">
      <div
        class="register-card backdrop-blur-sm bg-white/80 border border-white/20 shadow-2xl rounded-2xl p-8 transition-all duration-300 hover:shadow-3xl"
      >
        <!-- Logo 和标题 -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg"
          >
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
          </div>
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2"
          >
            用户注册
          </h1>
          <p class="text-gray-600 font-medium">创建您的管理员账户</p>
        </div>

        <!-- 注册表单 -->
        <a-form
          :model="formData"
          :rules="rules"
          @finish="handleSubmit"
          layout="vertical"
          class="space-y-6"
        >
          <a-form-item label="用户名" name="username" class="form-item-enhanced">
            <a-input
              v-model:value="formData.username"
              size="large"
              placeholder="请输入用户名"
              :prefix="h(UserOutlined)"
              class="input-enhanced"
            />
          </a-form-item>

          <a-form-item label="邮箱" name="email" class="form-item-enhanced">
            <a-input
              v-model:value="formData.email"
              size="large"
              placeholder="请输入邮箱地址"
              :prefix="h(MailOutlined)"
              class="input-enhanced"
            />
          </a-form-item>

          <a-form-item label="密码" name="password" class="form-item-enhanced">
            <a-input-password
              v-model:value="formData.password"
              size="large"
              placeholder="请输入密码"
              :prefix="h(LockOutlined)"
              class="input-enhanced"
            />
          </a-form-item>

          <a-form-item label="确认密码" name="confirmPassword" class="form-item-enhanced">
            <a-input-password
              v-model:value="formData.confirmPassword"
              size="large"
              placeholder="请再次输入密码"
              :prefix="h(LockOutlined)"
              class="input-enhanced"
            />
          </a-form-item>

          <a-form-item>
            <a-checkbox v-model:checked="formData.agreeTerms" class="checkbox-enhanced">
              <span class="text-sm text-gray-600">
                我已阅读并同意
                <a href="#" class="text-blue-600 hover:text-blue-700">用户协议</a>
                和
                <a href="#" class="text-blue-600 hover:text-blue-700">隐私政策</a>
              </span>
            </a-checkbox>
          </a-form-item>

          <a-form-item class="mb-0">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              block
              :loading="loading"
              class="btn-enhanced h-12 text-base font-semibold"
            >
              <span v-if="!loading">注册账户</span>
              <span v-else>注册中...</span>
            </a-button>
          </a-form-item>
        </a-form>

        <!-- 登录链接 -->
        <div class="text-center mt-8 pt-6 border-t border-gray-100">
          <span class="text-gray-600">已有账号？</span>
          <router-link
            to="/login"
            class="text-blue-600 hover:text-blue-700 ml-1 font-medium transition-colors duration-200"
          >
            立即登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const loading = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: '密码必须包含大小写字母和数字',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string) => {
        if (value !== formData.password) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
  agreeTerms: [
    {
      validator: (rule: any, value: boolean) => {
        if (!value) {
          return Promise.reject('请同意用户协议和隐私政策')
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
}

// 提交注册
const handleSubmit = async () => {
  try {
    loading.value = true

    // 模拟注册请求
    await new Promise((resolve) => setTimeout(resolve, 2000))

    message.success('注册成功！请登录您的账户')
    router.push('/login')
  } catch (error) {
    message.error('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-item-enhanced :deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.input-enhanced :deep(.ant-input-affix-wrapper) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.input-enhanced :deep(.ant-input-affix-wrapper:hover) {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-enhanced :deep(.ant-input-affix-wrapper-focused) {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-enhanced :deep(.ant-input) {
  background: transparent;
  font-size: 15px;
  padding: 12px 16px;
}

.input-enhanced :deep(.ant-input-prefix) {
  color: #6b7280;
  margin-right: 12px;
}

.btn-enhanced {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
}

.btn-enhanced:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 6px 20px 0 rgba(16, 185, 129, 0.4);
  transform: translateY(-1px);
}

.btn-enhanced:active {
  transform: translateY(0);
}

.checkbox-enhanced :deep(.ant-checkbox-wrapper) {
  font-size: 14px;
  color: #6b7280;
}

.checkbox-enhanced :deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #10b981;
  border-color: #10b981;
}

.checkbox-enhanced :deep(.ant-checkbox:hover .ant-checkbox-inner) {
  border-color: #10b981;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .register-card {
    margin: 1rem;
    padding: 1.5rem;
  }

  .register-card h1 {
    font-size: 1.75rem;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .register-card {
    background: rgba(17, 24, 39, 0.8);
    border-color: rgba(75, 85, 99, 0.3);
  }

  .form-item-enhanced :deep(.ant-form-item-label > label) {
    color: #f3f4f6;
  }

  .input-enhanced :deep(.ant-input-affix-wrapper) {
    background: rgba(31, 41, 55, 0.8);
    border-color: #4b5563;
    color: #f3f4f6;
  }

  .input-enhanced :deep(.ant-input) {
    background: transparent;
    color: #f3f4f6;
  }
}
</style>
