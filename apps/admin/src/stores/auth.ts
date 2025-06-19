import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import type { LoginDto, AuthUser, UserProfile } from '@admin-system/shared'
import * as authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<AuthUser | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
  const loading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => !!accessToken.value && !!user.value)
  const userRoles = computed(() => user.value?.roles || [])
  const userPermissions = computed(() => user.value?.permissions || [])

  // 设置认证信息
  const setAuth = (authData: { user: AuthUser; accessToken: string; refreshToken: string }) => {
    // 确保角色和权限是字符串数组格式
    const processedUser = {
      ...authData.user,
      roles: Array.isArray(authData.user.roles)
        ? authData.user.roles.map((role) => (typeof role === 'string' ? role : role.code))
        : [],
      permissions: Array.isArray(authData.user.permissions)
        ? authData.user.permissions.map((permission) =>
            typeof permission === 'string' ? permission : permission.code,
          )
        : [],
    }

    user.value = processedUser
    accessToken.value = authData.accessToken
    refreshToken.value = authData.refreshToken

    // 保存到本地存储
    localStorage.setItem('access_token', authData.accessToken)
    localStorage.setItem('refresh_token', authData.refreshToken)
  }

  // 清除认证信息
  const clearAuth = () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    // 清除本地存储
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  // 登录
  const login = async (loginData: LoginDto) => {
    try {
      loading.value = true
      const response = await authApi.login(loginData)

      if (response.success && response.data) {
        setAuth(response.data)
        message.success('登录成功')
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
      message.success('已退出登录')
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await authApi.getCurrentUser()
      if (response.success && response.data) {
        user.value = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          avatar: response.data.avatar,
          nickname: response.data.nickname,
          roles: response.data.roles.map((role) => role.code),
          permissions: response.data.permissions.map((permission) => permission.code),
        }
        return true
      }
      return false
    } catch (error) {
      console.error('Fetch user info error:', error)
      clearAuth()
      return false
    }
  }

  // 刷新 Token
  const refreshAccessToken = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token')
      }

      const response = await authApi.refreshToken({
        refreshToken: refreshToken.value,
      })

      if (response.success && response.data) {
        accessToken.value = response.data.accessToken
        refreshToken.value = response.data.refreshToken

        localStorage.setItem('access_token', response.data.accessToken)
        localStorage.setItem('refresh_token', response.data.refreshToken)

        return true
      }
      return false
    } catch (error) {
      console.error('Refresh token error:', error)
      clearAuth()
      return false
    }
  }

  // 检查权限
  const hasPermission = (permission: string) => {
    return userPermissions.value.includes(permission)
  }

  // 检查角色
  const hasRole = (role: string) => {
    return userRoles.value.includes(role)
  }

  // 检查多个权限（任一满足）
  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some((permission) => hasPermission(permission))
  }

  // 检查多个权限（全部满足）
  const hasAllPermissions = (permissions: string[]) => {
    return permissions.every((permission) => hasPermission(permission))
  }

  // 初始化认证状态
  const initAuth = async () => {
    if (accessToken.value) {
      const success = await fetchUserInfo()
      if (!success) {
        clearAuth()
      }
    }
  }

  return {
    // 状态
    user,
    accessToken,
    refreshToken,
    loading,

    // 计算属性
    isLoggedIn,
    userRoles,
    userPermissions,

    // 方法
    setAuth,
    clearAuth,
    login,
    logout,
    fetchUserInfo,
    refreshAccessToken,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    initAuth,
  }
})
