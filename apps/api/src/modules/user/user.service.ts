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
import { UserStatus } from '@admin-system/shared';

// 模拟用户数据（实际项目中应该使用数据库）
let mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    nickname: '管理员',
    status: UserStatus.ACTIVE,
    roles: ['admin'],
    permissions: [
      'user:view',
      'user:create',
      'user:update',
      'user:delete',
      'role:view',
      'role:create',
      'role:update',
      'role:delete',
    ],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    nickname: '普通用户',
    status: UserStatus.ACTIVE,
    roles: ['user'],
    permissions: ['user:view'],
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
  },
  {
    id: '3',
    username: 'editor',
    email: 'editor@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    nickname: '编辑员',
    status: UserStatus.ACTIVE,
    roles: ['editor'],
    permissions: ['user:view', 'user:update'],
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03'),
  },
];

@Injectable()
export class UserService {
  async findAll(queryDto: QueryUserDto) {
    const page = parseInt(queryDto.page || '1', 10);
    const limit = parseInt(queryDto.limit || '10', 10);
    const offset = (page - 1) * limit;

    let filteredUsers = [...mockUsers];

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
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(createUserDto: CreateUserDto) {
    // 检查用户名是否已存在
    const existingUser = mockUsers.find(
      (u) => u.username === createUserDto.username,
    );
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = mockUsers.find(
      (u) => u.email === createUserDto.email,
    );
    if (existingEmail) {
      throw new ConflictException('邮箱已存在');
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = {
      id: String(mockUsers.length + 1),
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      phone: createUserDto.phone,
      nickname: createUserDto.nickname || createUserDto.username,
      realName: createUserDto.realName,
      gender: createUserDto.gender,
      birthday: createUserDto.birthday,
      status: createUserDto.status || UserStatus.ACTIVE,
      roles: createUserDto.roleIds || ['user'],
      permissions: ['user:view'], // 默认权限
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUsers.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('用户不存在');
    }

    const user = mockUsers[userIndex];

    // 检查用户名是否已被其他用户使用
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = mockUsers.find(
        (u) => u.username === updateUserDto.username && u.id !== id,
      );
      if (existingUser) {
        throw new ConflictException('用户名已存在');
      }
    }

    // 检查邮箱是否已被其他用户使用
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = mockUsers.find(
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
    const updatedUser = {
      ...user,
      ...updateUserDto,
      roles: updateUserDto.roleIds || user.roles,
      updatedAt: new Date(),
    };

    mockUsers[userIndex] = updatedUser;

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string) {
    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('用户不存在');
    }

    // 不允许删除管理员账户
    if (mockUsers[userIndex].username === 'admin') {
      throw new BadRequestException('不能删除管理员账户');
    }

    mockUsers.splice(userIndex, 1);
    return { message: '用户删除成功' };
  }

  async batchDelete(ids: string[]) {
    const deletedUsers: string[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    for (const id of ids) {
      try {
        const userIndex = mockUsers.findIndex((u) => u.id === id);
        if (userIndex === -1) {
          errors.push({ id, error: '用户不存在' });
          continue;
        }

        if (mockUsers[userIndex].username === 'admin') {
          errors.push({ id, error: '不能删除管理员账户' });
          continue;
        }

        mockUsers.splice(userIndex, 1);
        deletedUsers.push(id);
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
    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('用户不存在');
    }

    mockUsers[userIndex].status = status;
    mockUsers[userIndex].updatedAt = new Date();

    const { password, ...userWithoutPassword } = mockUsers[userIndex];
    return userWithoutPassword;
  }

  async assignRoles(userId: string, roleIds: string[]) {
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new NotFoundException('用户不存在');
    }

    mockUsers[userIndex].roles = roleIds;
    mockUsers[userIndex].updatedAt = new Date();

    const { password, ...userWithoutPassword } = mockUsers[userIndex];
    return userWithoutPassword;
  }
}
