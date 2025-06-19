/**
 * 认证相关类型定义
 */

// JWT Token 载荷
export interface JwtPayload {
  sub: string;        // 用户 ID
  username: string;   // 用户名
  email: string;      // 邮箱
  roles: string[];    // 角色代码列表
  permissions: string[]; // 权限代码列表
  iat?: number;       // 签发时间
  exp?: number;       // 过期时间
}

// 认证响应
export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// 认证用户信息
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  nickname?: string;
  roles: string[];
  permissions: string[];
}

// Token 刷新请求
export interface RefreshTokenDto {
  refreshToken: string;
}

// Token 刷新响应
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// 登录状态
export interface LoginState {
  isLoggedIn: boolean;
  user?: AuthUser;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

// 忘记密码请求
export interface ForgotPasswordDto {
  email: string;
}

// 验证重置令牌请求
export interface VerifyResetTokenDto {
  token: string;
}

// 邮箱验证 DTO
export interface VerifyEmailDto {
  token: string;
}

// 发送验证邮件 DTO
export interface SendVerificationEmailDto {
  email: string;
}

// 认证错误类型
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  USER_NOT_FOUND = 'user_not_found',
  USER_INACTIVE = 'user_inactive',
  USER_BANNED = 'user_banned',
  EMAIL_NOT_VERIFIED = 'email_not_verified',
  TOKEN_EXPIRED = 'token_expired',
  TOKEN_INVALID = 'token_invalid',
  REFRESH_TOKEN_EXPIRED = 'refresh_token_expired',
  PERMISSION_DENIED = 'permission_denied',
  PASSWORD_TOO_WEAK = 'password_too_weak',
  EMAIL_ALREADY_EXISTS = 'email_already_exists',
  USERNAME_ALREADY_EXISTS = 'username_already_exists'
}

// 认证错误
export interface AuthError {
  type: AuthErrorType;
  message: string;
  details?: any;
}

// 会话信息
export interface SessionInfo {
  id: string;
  userId: string;
  userAgent?: string;
  ip?: string;
  lastActiveAt: Date;
  createdAt: Date;
  expiresAt: Date;
}

// 在线用户信息
export interface OnlineUser {
  userId: string;
  username: string;
  avatar?: string;
  loginTime: Date;
  lastActiveTime: Date;
  ip?: string;
  userAgent?: string;
}
