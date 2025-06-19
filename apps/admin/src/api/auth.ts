import { http } from '@/utils/request'
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  RefreshTokenDto,
  RefreshTokenResponse,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UserProfile,
} from '@admin-system/shared'

/**
 * 用户登录
 */
export function login(data: LoginDto) {
  return http.post<AuthResponse>('/v1/auth/login', data)
}

/**
 * 用户注册
 */
export function register(data: RegisterDto) {
  return http.post<AuthResponse>('/v1/auth/register', data)
}

/**
 * 刷新 Token
 */
export function refreshToken(data: RefreshTokenDto) {
  return http.post<RefreshTokenResponse>('/v1/auth/refresh', data)
}

/**
 * 用户登出
 */
export function logout() {
  return http.post('/v1/auth/logout')
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  return http.get<UserProfile>('/v1/auth/profile')
}

/**
 * 更新用户资料
 */
export function updateProfile(data: Partial<UserProfile>) {
  return http.put<UserProfile>('/v1/auth/profile', data)
}

/**
 * 修改密码
 */
export function changePassword(data: ChangePasswordDto) {
  return http.post('/v1/auth/change-password', data)
}

/**
 * 忘记密码
 */
export function forgotPassword(data: ForgotPasswordDto) {
  return http.post('/v1/auth/forgot-password', data)
}

/**
 * 重置密码
 */
export function resetPassword(data: ResetPasswordDto) {
  return http.post('/v1/auth/reset-password', data)
}
