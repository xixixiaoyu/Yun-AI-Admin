/**
 * 角色相关类型定义
 */

// 角色状态枚举
export enum RoleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// 角色类型枚举
export enum RoleType {
  SYSTEM = 'system', // 系统角色
  CUSTOM = 'custom', // 自定义角色
}

// 角色基础信息接口
export interface Role {
  id: string
  name: string
  code: string
  description?: string
  type: RoleType
  status: RoleStatus
  sort: number
  createdAt: Date
  updatedAt: Date
  permissions: Permission[]
  userCount?: number
}

// 角色创建 DTO
export interface CreateRoleDto {
  name: string
  code: string
  description?: string
  type?: RoleType
  status?: RoleStatus
  sort?: number
  permissionIds?: string[]
}

// 角色更新 DTO
export interface UpdateRoleDto {
  name?: string
  code?: string
  description?: string
  status?: RoleStatus
  sort?: number
  permissionIds?: string[]
}

// 角色查询参数
export interface RoleQueryDto {
  page?: number
  limit?: number
  keyword?: string
  status?: RoleStatus
  type?: RoleType
}

// 角色列表响应
export interface RoleListResponse {
  roles: Role[]
  total: number
  page: number
  limit: number
}

// 角色权限分配 DTO
export interface AssignPermissionsDto {
  roleId: string
  permissionIds: string[]
}

// 用户角色分配 DTO
export interface AssignRolesDto {
  userId: string
  roleIds: string[]
}

// 角色选项（用于下拉选择）
export interface RoleOption {
  id: string
  name: string
  code: string
  disabled?: boolean
}

// 导入权限类型
import type { Permission } from './permission'
