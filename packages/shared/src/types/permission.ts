/**
 * 权限相关类型定义
 */

// 权限类型枚举
export enum PermissionType {
  MENU = 'menu',        // 菜单权限
  BUTTON = 'button',    // 按钮权限
  API = 'api'           // API 权限
}

// 权限状态枚举
export enum PermissionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// 权限基础信息接口
export interface Permission {
  id: string;
  name: string;
  code: string;
  type: PermissionType;
  parentId?: string;
  path?: string;
  component?: string;
  icon?: string;
  sort: number;
  status: PermissionStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  children?: Permission[];
  parent?: Permission;
}

// 权限创建 DTO
export interface CreatePermissionDto {
  name: string;
  code: string;
  type: PermissionType;
  parentId?: string;
  path?: string;
  component?: string;
  icon?: string;
  sort?: number;
  status?: PermissionStatus;
  description?: string;
}

// 权限更新 DTO
export interface UpdatePermissionDto {
  name?: string;
  code?: string;
  type?: PermissionType;
  parentId?: string;
  path?: string;
  component?: string;
  icon?: string;
  sort?: number;
  status?: PermissionStatus;
  description?: string;
}

// 权限查询参数
export interface PermissionQueryDto {
  keyword?: string;
  type?: PermissionType;
  status?: PermissionStatus;
  parentId?: string;
}

// 权限树节点
export interface PermissionTreeNode {
  id: string;
  name: string;
  code: string;
  type: PermissionType;
  parentId?: string;
  path?: string;
  component?: string;
  icon?: string;
  sort: number;
  status: PermissionStatus;
  description?: string;
  children?: PermissionTreeNode[];
  checked?: boolean;
  expanded?: boolean;
}

// 菜单权限（用于前端路由生成）
export interface MenuPermission {
  id: string;
  name: string;
  code: string;
  path: string;
  component?: string;
  icon?: string;
  sort: number;
  parentId?: string;
  children?: MenuPermission[];
  meta?: {
    title: string;
    icon?: string;
    hidden?: boolean;
    keepAlive?: boolean;
    requireAuth?: boolean;
  };
}

// 权限检查结果
export interface PermissionCheckResult {
  hasPermission: boolean;
  missingPermissions?: string[];
}

// 用户权限信息
export interface UserPermissions {
  userId: string;
  permissions: Permission[];
  menuPermissions: MenuPermission[];
  buttonPermissions: string[];
  apiPermissions: string[];
}
