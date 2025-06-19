import { http } from '@/utils/request'
import type {
  CreateRoleDto,
  UpdateRoleDto,
  RoleQueryDto,
  RoleListResponse,
  Role,
  RoleOption,
  AssignPermissionsDto,
} from '@admin-system/shared'

/**
 * 获取角色列表
 */
export function getRoleList(params: RoleQueryDto) {
  return http.get<RoleListResponse>('/v1/roles', { params })
}

/**
 * 获取角色选项（用于下拉选择）
 */
export function getRoleOptions() {
  return http.get<RoleOption[]>('/v1/roles/options')
}

/**
 * 获取角色详情
 */
export function getRoleDetail(id: string) {
  return http.get<Role>(`/v1/roles/${id}`)
}

/**
 * 创建角色
 */
export function createRole(data: CreateRoleDto) {
  return http.post<Role>('/v1/roles', data)
}

/**
 * 更新角色信息
 */
export function updateRole(id: string, data: UpdateRoleDto) {
  return http.patch<Role>(`/v1/roles/${id}`, data)
}

/**
 * 删除角色
 */
export function deleteRole(id: string) {
  return http.delete(`/v1/roles/${id}`)
}

/**
 * 分配角色权限
 */
export function assignRolePermissions(id: string, permissionIds: string[]) {
  return http.post<Role>(`/v1/roles/${id}/permissions`, { permissionIds })
}
