import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  MockDataService,
  RoleStatus,
  RoleType,
} from '../../common/mock/mock-data.service';

@Injectable()
export class RoleService {
  constructor(private readonly mockDataService: MockDataService) {}
  async findAll(query?: any) {
    let filteredRoles = this.mockDataService.getRoles();

    // 关键词搜索
    if (query?.keyword) {
      const keyword = query.keyword.toLowerCase();
      filteredRoles = filteredRoles.filter(
        (role) =>
          role.name.toLowerCase().includes(keyword) ||
          role.code.toLowerCase().includes(keyword) ||
          role.description?.toLowerCase().includes(keyword),
      );
    }

    // 状态筛选
    if (query?.status) {
      filteredRoles = filteredRoles.filter(
        (role) => role.status === query.status,
      );
    }

    // 类型筛选
    if (query?.type) {
      filteredRoles = filteredRoles.filter((role) => role.type === query.type);
    }

    // 分页
    const page = parseInt(query?.page || '1', 10);
    const limit = parseInt(query?.limit || '10', 10);
    const offset = (page - 1) * limit;
    const total = filteredRoles.length;

    const roles = filteredRoles
      .sort((a, b) => a.sort - b.sort)
      .slice(offset, offset + limit)
      .map((role) => ({
        ...role,
        userCount: this.mockDataService.getUserCountByRole(role.code),
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
    const roles = this.mockDataService.getRoles();
    const role = roles.find((r) => r.id === id);
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    return {
      ...role,
      userCount: this.mockDataService.getUserCountByRole(role.code),
    };
  }

  async create(createRoleDto: any) {
    const roles = this.mockDataService.getRoles();

    // 检查角色代码是否已存在
    const existingRole = roles.find((r) => r.code === createRoleDto.code);
    if (existingRole) {
      throw new ConflictException('角色代码已存在');
    }

    const newRole = {
      id: String(roles.length + 1),
      name: createRoleDto.name,
      code: createRoleDto.code,
      description: createRoleDto.description,
      type: createRoleDto.type || RoleType.CUSTOM,
      status: createRoleDto.status || RoleStatus.ACTIVE,
      sort: createRoleDto.sort || roles.length + 1,
      permissions: createRoleDto.permissionIds || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockDataService.addRole(newRole);
    return newRole;
  }

  async update(id: string, updateRoleDto: any) {
    const roles = this.mockDataService.getRoles();
    const role = roles.find((r) => r.id === id);
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    // 检查角色代码是否已被其他角色使用
    if (updateRoleDto.code && updateRoleDto.code !== role.code) {
      const existingRole = roles.find(
        (r) => r.code === updateRoleDto.code && r.id !== id,
      );
      if (existingRole) {
        throw new ConflictException('角色代码已存在');
      }
    }

    const updatedRole = this.mockDataService.updateRole(id, {
      ...updateRoleDto,
      permissions: updateRoleDto.permissionIds || role.permissions,
    });

    return updatedRole;
  }

  async remove(id: string) {
    const roles = this.mockDataService.getRoles();
    const role = roles.find((r) => r.id === id);
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    // 不允许删除系统角色
    if (role.type === RoleType.SYSTEM) {
      throw new ConflictException('不能删除系统角色');
    }

    // 检查是否有用户使用该角色
    const userCount = this.mockDataService.getUserCountByRole(role.code);
    if (userCount > 0) {
      throw new ConflictException('该角色正在被使用，无法删除');
    }

    const success = this.mockDataService.removeRole(id);
    if (!success) {
      throw new NotFoundException('角色不存在');
    }

    return { message: '角色删除成功' };
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    const updatedRole = this.mockDataService.updateRole(roleId, {
      permissions: permissionIds,
    });

    if (!updatedRole) {
      throw new NotFoundException('角色不存在');
    }

    return updatedRole;
  }

  async getOptions() {
    const roles = this.mockDataService.getRoles();
    return roles
      .filter((role) => role.status === RoleStatus.ACTIVE)
      .sort((a, b) => a.sort - b.sort)
      .map((role) => ({
        id: role.id,
        name: role.name,
        code: role.code,
        disabled: role.type === RoleType.SYSTEM && role.code === 'super_admin',
      }));
  }
}
