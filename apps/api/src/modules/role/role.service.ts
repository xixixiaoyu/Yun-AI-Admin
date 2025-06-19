import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { RoleStatus, RoleType } from '@admin-system/shared';

// 模拟角色数据
let mockRoles = [
  {
    id: '1',
    name: '超级管理员',
    code: 'super_admin',
    description: '系统超级管理员，拥有所有权限',
    type: RoleType.SYSTEM,
    status: RoleStatus.ACTIVE,
    sort: 1,
    permissions: ['user:view', 'user:create', 'user:update', 'user:delete', 'role:view', 'role:create', 'role:update', 'role:delete', 'permission:view', 'permission:create', 'permission:update', 'permission:delete'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: '管理员',
    code: 'admin',
    description: '系统管理员',
    type: RoleType.SYSTEM,
    status: RoleStatus.ACTIVE,
    sort: 2,
    permissions: ['user:view', 'user:create', 'user:update', 'user:delete', 'role:view'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '3',
    name: '编辑员',
    code: 'editor',
    description: '内容编辑员',
    type: RoleType.CUSTOM,
    status: RoleStatus.ACTIVE,
    sort: 3,
    permissions: ['user:view', 'user:update'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '4',
    name: '普通用户',
    code: 'user',
    description: '普通用户',
    type: RoleType.SYSTEM,
    status: RoleStatus.ACTIVE,
    sort: 4,
    permissions: ['user:view'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
];

@Injectable()
export class RoleService {
  async findAll(query?: any) {
    let filteredRoles = [...mockRoles];

    // 关键词搜索
    if (query?.keyword) {
      const keyword = query.keyword.toLowerCase();
      filteredRoles = filteredRoles.filter(role =>
        role.name.toLowerCase().includes(keyword) ||
        role.code.toLowerCase().includes(keyword) ||
        role.description?.toLowerCase().includes(keyword)
      );
    }

    // 状态筛选
    if (query?.status) {
      filteredRoles = filteredRoles.filter(role => role.status === query.status);
    }

    // 类型筛选
    if (query?.type) {
      filteredRoles = filteredRoles.filter(role => role.type === query.type);
    }

    // 分页
    const page = parseInt(query?.page || '1', 10);
    const limit = parseInt(query?.limit || '10', 10);
    const offset = (page - 1) * limit;
    const total = filteredRoles.length;

    const roles = filteredRoles
      .sort((a, b) => a.sort - b.sort)
      .slice(offset, offset + limit)
      .map(role => ({
        ...role,
        userCount: this.getUserCountByRole(role.code),
      }));

    return {
      roles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string) {
    const role = mockRoles.find(r => r.id === id);
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    return {
      ...role,
      userCount: this.getUserCountByRole(role.code),
    };
  }

  async create(createRoleDto: any) {
    // 检查角色代码是否已存在
    const existingRole = mockRoles.find(r => r.code === createRoleDto.code);
    if (existingRole) {
      throw new ConflictException('角色代码已存在');
    }

    const newRole = {
      id: String(mockRoles.length + 1),
      name: createRoleDto.name,
      code: createRoleDto.code,
      description: createRoleDto.description,
      type: createRoleDto.type || RoleType.CUSTOM,
      status: createRoleDto.status || RoleStatus.ACTIVE,
      sort: createRoleDto.sort || mockRoles.length + 1,
      permissions: createRoleDto.permissionIds || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRoles.push(newRole);
    return newRole;
  }

  async update(id: string, updateRoleDto: any) {
    const roleIndex = mockRoles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      throw new NotFoundException('角色不存在');
    }

    const role = mockRoles[roleIndex];

    // 检查角色代码是否已被其他角色使用
    if (updateRoleDto.code && updateRoleDto.code !== role.code) {
      const existingRole = mockRoles.find(r => r.code === updateRoleDto.code && r.id !== id);
      if (existingRole) {
        throw new ConflictException('角色代码已存在');
      }
    }

    const updatedRole = {
      ...role,
      ...updateRoleDto,
      permissions: updateRoleDto.permissionIds || role.permissions,
      updatedAt: new Date(),
    };

    mockRoles[roleIndex] = updatedRole;
    return updatedRole;
  }

  async remove(id: string) {
    const roleIndex = mockRoles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      throw new NotFoundException('角色不存在');
    }

    const role = mockRoles[roleIndex];

    // 不允许删除系统角色
    if (role.type === RoleType.SYSTEM) {
      throw new ConflictException('不能删除系统角色');
    }

    // 检查是否有用户使用该角色
    const userCount = this.getUserCountByRole(role.code);
    if (userCount > 0) {
      throw new ConflictException('该角色正在被使用，无法删除');
    }

    mockRoles.splice(roleIndex, 1);
    return { message: '角色删除成功' };
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    const roleIndex = mockRoles.findIndex(r => r.id === roleId);
    if (roleIndex === -1) {
      throw new NotFoundException('角色不存在');
    }

    mockRoles[roleIndex].permissions = permissionIds;
    mockRoles[roleIndex].updatedAt = new Date();

    return mockRoles[roleIndex];
  }

  async getOptions() {
    return mockRoles
      .filter(role => role.status === RoleStatus.ACTIVE)
      .sort((a, b) => a.sort - b.sort)
      .map(role => ({
        id: role.id,
        name: role.name,
        code: role.code,
        disabled: role.type === RoleType.SYSTEM && role.code === 'super_admin',
      }));
  }

  private getUserCountByRole(roleCode: string): number {
    // 这里应该查询数据库获取实际的用户数量
    // 暂时返回模拟数据
    const userCounts = {
      'super_admin': 1,
      'admin': 1,
      'editor': 1,
      'user': 1,
    };
    return userCounts[roleCode] || 0;
  }
}
