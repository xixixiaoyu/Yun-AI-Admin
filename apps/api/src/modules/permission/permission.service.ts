import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';
import {
  MockDataService,
  MockPermission,
} from '../../common/mock/mock-data.service';
import { PermissionStatus } from '../../common/mock/mock-data.service';

@Injectable()
export class PermissionService {
  constructor(private readonly mockDataService: MockDataService) {}

  async findAll(queryDto?: QueryPermissionDto) {
    let permissions = this.mockDataService.getPermissions();

    // 关键词搜索
    if (queryDto?.keyword) {
      const keyword = queryDto.keyword.toLowerCase();
      permissions = permissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(keyword) ||
          permission.code.toLowerCase().includes(keyword) ||
          permission.description?.toLowerCase().includes(keyword),
      );
    }

    // 类型筛选
    if (queryDto?.type) {
      permissions = permissions.filter(
        (permission) => permission.type === queryDto.type,
      );
    }

    // 状态筛选
    if (queryDto?.status) {
      permissions = permissions.filter(
        (permission) => permission.status === queryDto.status,
      );
    }

    // 父级筛选
    if (queryDto?.parentId) {
      permissions = permissions.filter(
        (permission) => permission.parentId === queryDto.parentId,
      );
    }

    // 是否返回树形结构
    if (queryDto?.tree === 'true') {
      return this.mockDataService.buildPermissionTree(permissions);
    }

    // 排序
    permissions.sort((a, b) => a.sort - b.sort);

    return permissions;
  }

  async findOne(id: string) {
    const permissions = this.mockDataService.getPermissions();
    const permission = permissions.find((p) => p.id === id);

    if (!permission) {
      throw new NotFoundException('权限不存在');
    }

    return permission;
  }

  async create(createPermissionDto: CreatePermissionDto) {
    const permissions = this.mockDataService.getPermissions();

    // 检查权限代码是否已存在
    const existingPermission = permissions.find(
      (p) => p.code === createPermissionDto.code,
    );
    if (existingPermission) {
      throw new ConflictException('权限代码已存在');
    }

    // 如果有父级权限，检查父级权限是否存在
    if (createPermissionDto.parentId) {
      const parentPermission = permissions.find(
        (p) => p.id === createPermissionDto.parentId,
      );
      if (!parentPermission) {
        throw new NotFoundException('父级权限不存在');
      }
    }

    const newPermission: MockPermission = {
      id: String(permissions.length + 1),
      name: createPermissionDto.name,
      code: createPermissionDto.code,
      type: createPermissionDto.type,
      parentId: createPermissionDto.parentId,
      path: createPermissionDto.path,
      component: createPermissionDto.component,
      icon: createPermissionDto.icon,
      sort: createPermissionDto.sort || permissions.length + 1,
      status: createPermissionDto.status || PermissionStatus.ACTIVE,
      description: createPermissionDto.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockDataService.addPermission(newPermission);
    return newPermission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permissions = this.mockDataService.getPermissions();
    const permission = permissions.find((p) => p.id === id);

    if (!permission) {
      throw new NotFoundException('权限不存在');
    }

    // 检查权限代码是否已被其他权限使用
    if (
      updatePermissionDto.code &&
      updatePermissionDto.code !== permission.code
    ) {
      const existingPermission = permissions.find(
        (p) => p.code === updatePermissionDto.code && p.id !== id,
      );
      if (existingPermission) {
        throw new ConflictException('权限代码已存在');
      }
    }

    // 如果有父级权限，检查父级权限是否存在
    if (updatePermissionDto.parentId) {
      const parentPermission = permissions.find(
        (p) => p.id === updatePermissionDto.parentId,
      );
      if (!parentPermission) {
        throw new NotFoundException('父级权限不存在');
      }

      // 检查是否会形成循环引用
      if (
        this.wouldCreateCircularReference(
          id,
          updatePermissionDto.parentId,
          permissions,
        )
      ) {
        throw new ConflictException('不能将权限设置为自己的子权限');
      }
    }

    const updatedPermission = this.mockDataService.updatePermission(
      id,
      updatePermissionDto,
    );
    return updatedPermission;
  }

  async remove(id: string) {
    const permissions = this.mockDataService.getPermissions();
    const permission = permissions.find((p) => p.id === id);

    if (!permission) {
      throw new NotFoundException('权限不存在');
    }

    // 检查是否有子权限
    const hasChildren = permissions.some((p) => p.parentId === id);
    if (hasChildren) {
      throw new ConflictException('该权限下还有子权限，无法删除');
    }

    const success = this.mockDataService.removePermission(id);
    if (!success) {
      throw new NotFoundException('权限不存在');
    }

    return { message: '权限删除成功' };
  }

  async getTree() {
    const permissions = this.mockDataService
      .getPermissions()
      .filter((p) => p.status === PermissionStatus.ACTIVE);

    return this.mockDataService.buildPermissionTree(permissions);
  }

  async getMenuTree() {
    const permissions = this.mockDataService
      .getPermissions()
      .filter((p) => p.status === PermissionStatus.ACTIVE && p.type === 'menu');

    return this.mockDataService.buildPermissionTree(permissions);
  }

  // 检查是否会形成循环引用
  private wouldCreateCircularReference(
    permissionId: string,
    parentId: string,
    permissions: MockPermission[],
  ): boolean {
    let currentParentId: string | undefined = parentId;

    while (currentParentId) {
      if (currentParentId === permissionId) {
        return true;
      }

      const parent = permissions.find((p) => p.id === currentParentId);
      currentParentId = parent?.parentId;
    }

    return false;
  }
}
