/**
 * 系统常量定义
 */

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API 响应码
export const API_CODE = {
  SUCCESS: 0,
  INVALID_PARAMS: 1001,
  UNAUTHORIZED: 1002,
  FORBIDDEN: 1003,
  NOT_FOUND: 1004,
  CONFLICT: 1005,
  INTERNAL_ERROR: 1006,
  TOKEN_EXPIRED: 1007,
  TOKEN_INVALID: 1008,
  USER_NOT_FOUND: 2001,
  USER_INACTIVE: 2002,
  USER_BANNED: 2003,
  INVALID_CREDENTIALS: 2004,
  EMAIL_NOT_VERIFIED: 2005,
  PASSWORD_TOO_WEAK: 2006,
  EMAIL_EXISTS: 2007,
  USERNAME_EXISTS: 2008,
} as const;

// 分页默认值
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Token 配置
export const TOKEN = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  RESET_PASSWORD_TOKEN_EXPIRES_IN: '1h',
  EMAIL_VERIFICATION_TOKEN_EXPIRES_IN: '24h',
} as const;

// 缓存键前缀
export const CACHE_KEY = {
  USER: 'user:',
  ROLE: 'role:',
  PERMISSION: 'permission:',
  SESSION: 'session:',
  RESET_TOKEN: 'reset_token:',
  VERIFICATION_TOKEN: 'verification_token:',
  RATE_LIMIT: 'rate_limit:',
} as const;

// 文件上传配置
export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const;

// 正则表达式
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  URL: /^https?:\/\/.+/,
} as const;

// 默认头像
export const DEFAULT_AVATAR = '/assets/images/default-avatar.png';

// 系统角色代码
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user',
} as const;

// 系统权限代码
export const SYSTEM_PERMISSIONS = {
  // 用户管理
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // 角色管理
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  
  // 权限管理
  PERMISSION_VIEW: 'permission:view',
  PERMISSION_CREATE: 'permission:create',
  PERMISSION_UPDATE: 'permission:update',
  PERMISSION_DELETE: 'permission:delete',
  
  // 系统设置
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_LOG: 'system:log',
} as const;

// 菜单路径
export const MENU_PATHS = {
  DASHBOARD: '/dashboard',
  USER_MANAGEMENT: '/user',
  ROLE_MANAGEMENT: '/role',
  PERMISSION_MANAGEMENT: '/permission',
  SYSTEM_CONFIG: '/system/config',
  SYSTEM_LOG: '/system/log',
  PROFILE: '/profile',
} as const;

// 操作类型
export const OPERATION_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LOGIN: 'login',
  LOGOUT: 'logout',
  EXPORT: 'export',
  IMPORT: 'import',
} as const;

// 通知类型
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;
