import { http } from '@/utils/request'
import type {
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionQueryDto,
  PermissionTreeNode,
  MenuPermission,
  ApiResponse,
  PaginatedResponse,
} from '@admin-system/shared'

/**
 * 获取权限列表
 */
export const getPermissions = (params?: PermissionQueryDto) => {
  return http.get<PaginatedResponse<Permission>>('/v1/permissions', { params })
}

/**
 * 获取权限树
 */
export function getPermissionTree() {
  return http.get<PermissionTreeNode[]>('/v1/permissions/tree')
}

/**
 * 获取菜单权限树
 */
export function getMenuTree() {
  return http.get<MenuPermission[]>('/v1/permissions/menu-tree')
}

/**
 * 获取权限详情
 */
export const getPermission = (id: string) => {
  return http.get<Permission>(`/permissions/${id}`)
}

/**
 * 创建权限
 */
export const createPermission = (data: CreatePermissionDto) => {
  return http.post<Permission>('/permissions', data)
}

/**
 * 更新权限
 */
export const updatePermission = (id: string, data: UpdatePermissionDto) => {
  return http.patch<Permission>(`/permissions/${id}`, data)
}

/**
 * 删除权限
 */
export const deletePermission = (id: string) => {
  return http.delete(`/permissions/${id}`)
}
