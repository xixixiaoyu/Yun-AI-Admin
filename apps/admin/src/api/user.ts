import { http } from '@/utils/request'
import type {
  CreateUserDto,
  UpdateUserDto,
  UserQueryDto,
  UserListResponse,
  User,
  BatchOperationResponse,
  UserStatus,
} from '@admin-system/shared'

/**
 * 获取用户列表
 */
export function getUserList(params: UserQueryDto) {
  return http.get<UserListResponse>('/v1/users', { params })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: string) {
  return http.get<User>(`/v1/users/${id}`)
}

/**
 * 创建用户
 */
export function createUser(data: CreateUserDto) {
  return http.post<User>('/v1/users', data)
}

/**
 * 更新用户信息
 */
export function updateUser(id: string, data: UpdateUserDto) {
  return http.patch<User>(`/v1/users/${id}`, data)
}

/**
 * 删除用户
 */
export function deleteUser(id: string) {
  return http.delete(`/v1/users/${id}`)
}

/**
 * 批量删除用户
 */
export function batchDeleteUsers(ids: string[]) {
  return http.post<BatchOperationResponse>('/v1/users/batch-delete', { ids })
}

/**
 * 更新用户状态
 */
export function updateUserStatus(id: string, status: UserStatus) {
  return http.patch<User>(`/v1/users/${id}/status`, { status })
}

/**
 * 分配用户角色
 */
export function assignUserRoles(id: string, roleIds: string[]) {
  return http.post<User>(`/v1/users/${id}/roles`, { roleIds })
}
