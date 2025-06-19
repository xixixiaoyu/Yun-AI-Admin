import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import {
  MockDataService,
  UserStatus,
} from '../../common/mock/mock-data.service';

@Injectable()
export class UserService {
  constructor(private readonly mockDataService: MockDataService) {}
  async findAll(queryDto: QueryUserDto) {
    const page = parseInt(queryDto.page || '1', 10);
    const limit = parseInt(queryDto.limit || '10', 10);
    const offset = (page - 1) * limit;

    let filteredUsers = this.mockDataService.getUsers();

    // 关键词搜索
    if (queryDto.keyword) {
      const keyword = queryDto.keyword.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(keyword) ||
          user.email.toLowerCase().includes(keyword) ||
          user.nickname?.toLowerCase().includes(keyword),
      );
    }

    // 状态筛选
    if (queryDto.status) {
      filteredUsers = filteredUsers.filter(
        (user) => user.status === queryDto.status,
      );
    }

    // 角色筛选
    if (queryDto.roleId) {
      filteredUsers = filteredUsers.filter((user) =>
        user.roles.includes(queryDto.roleId!),
      );
    }

    // 日期筛选
    if (queryDto.startDate) {
      const startDate = new Date(queryDto.startDate);
      filteredUsers = filteredUsers.filter(
        (user) => user.createdAt >= startDate,
      );
    }

    if (queryDto.endDate) {
      const endDate = new Date(queryDto.endDate);
      filteredUsers = filteredUsers.filter((user) => user.createdAt <= endDate);
    }

    const total = filteredUsers.length;
    const users = filteredUsers.slice(offset, offset + limit).map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string) {
    const users = this.mockDataService.getUsers();
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(createUserDto: CreateUserDto) {
    const users = this.mockDataService.getUsers();

    // 检查用户名是否已存在
    const existingUser = users.find(
      (u) => u.username === createUserDto.username,
    );
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = users.find((u) => u.email === createUserDto.email);
    if (existingEmail) {
      throw new ConflictException('邮箱已存在');
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = {
      id: String(users.length + 1),
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      phone: createUserDto.phone,
      nickname: createUserDto.nickname || createUserDto.username,
      realName: createUserDto.realName,
      gender: createUserDto.gender,
      birthday: createUserDto.birthday,
      status: createUserDto.status || UserStatus.ACTIVE,
      emailVerified: false,
      roles: createUserDto.roleIds || ['user'],
      permissions: [], // 默认无直接权限，通过角色获得
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockDataService.addUser(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const users = this.mockDataService.getUsers();
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查用户名是否已被其他用户使用
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = users.find(
        (u) => u.username === updateUserDto.username && u.id !== id,
      );
      if (existingUser) {
        throw new ConflictException('用户名已存在');
      }
    }

    // 检查邮箱是否已被其他用户使用
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = users.find(
        (u) => u.email === updateUserDto.email && u.id !== id,
      );
      if (existingEmail) {
        throw new ConflictException('邮箱已存在');
      }
    }

    // 更新密码
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // 更新用户信息
    const updatedUser = this.mockDataService.updateUser(id, {
      ...updateUserDto,
      roles: updateUserDto.roleIds || user.roles,
    });

    if (!updatedUser) {
      throw new NotFoundException('用户不存在');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string) {
    const users = this.mockDataService.getUsers();
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 不允许删除管理员账户
    if (user.username === 'superadmin' || user.username === 'admin') {
      throw new BadRequestException('不能删除管理员账户');
    }

    const success = this.mockDataService.removeUser(id);
    if (!success) {
      throw new NotFoundException('用户不存在');
    }

    return { message: '用户删除成功' };
  }

  async batchDelete(ids: string[]) {
    const deletedUsers: string[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    for (const id of ids) {
      try {
        const users = this.mockDataService.getUsers();
        const user = users.find((u) => u.id === id);
        if (!user) {
          errors.push({ id, error: '用户不存在' });
          continue;
        }

        if (user.username === 'superadmin' || user.username === 'admin') {
          errors.push({ id, error: '不能删除管理员账户' });
          continue;
        }

        const success = this.mockDataService.removeUser(id);
        if (success) {
          deletedUsers.push(id);
        } else {
          errors.push({ id, error: '删除失败' });
        }
      } catch (error) {
        errors.push({ id, error: error.message });
      }
    }

    return {
      success: deletedUsers.length,
      failed: errors.length,
      errors,
    };
  }

  async updateStatus(id: string, status: UserStatus) {
    const updatedUser = this.mockDataService.updateUser(id, { status });
    if (!updatedUser) {
      throw new NotFoundException('用户不存在');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async assignRoles(userId: string, roleIds: string[]) {
    const updatedUser = this.mockDataService.updateUser(userId, {
      roles: roleIds,
    });
    if (!updatedUser) {
      throw new NotFoundException('用户不存在');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
