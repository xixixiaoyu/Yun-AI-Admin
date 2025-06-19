/**
 * 用户相关类型定义
 */

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}

// 用户性别枚举
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// 用户基础信息接口
export interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  nickname?: string
  realName?: string
  gender?: Gender
  birthday?: Date
  status: UserStatus
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
  roles: Role[]
}

// 用户创建 DTO
export interface CreateUserDto {
  username: string
  email: string
  password: string
  phone?: string
  nickname?: string
  realName?: string
  gender?: Gender
  birthday?: Date
  roleIds?: string[]
}

// 用户更新 DTO
export interface UpdateUserDto {
  username?: string
  email?: string
  phone?: string
  avatar?: string
  nickname?: string
  realName?: string
  gender?: Gender
  birthday?: Date
  status?: UserStatus
  roleIds?: string[]
}

// 用户登录 DTO
export interface LoginDto {
  username: string
  password: string
  remember?: boolean
}

// 用户注册 DTO
export interface RegisterDto {
  username: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  nickname?: string
}

// 密码重置 DTO
export interface ResetPasswordDto {
  email: string
  token: string
  newPassword: string
  confirmPassword: string
}

// 修改密码 DTO
export interface ChangePasswordDto {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// 用户查询参数
export interface UserQueryDto {
  page?: number
  limit?: number
  keyword?: string
  status?: UserStatus
  roleId?: string
  startDate?: Date
  endDate?: Date
}

// 用户列表响应
export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

// 用户个人资料
export interface UserProfile {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  nickname?: string
  realName?: string
  gender?: Gender
  birthday?: Date
  lastLoginAt?: Date
  createdAt: Date
  roles: Role[]
  permissions: Permission[]
}

// 导入角色和权限类型
import type { Role } from './role'
import type { Permission } from './permission'
