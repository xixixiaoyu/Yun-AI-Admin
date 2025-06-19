import { Injectable } from '@nestjs/common';

// 枚举定义
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum RoleType {
  SYSTEM = 'system',
  CUSTOM = 'custom',
}

export enum RoleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum PermissionType {
  MENU = 'menu',
  BUTTON = 'button',
  API = 'api',
}

export enum PermissionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// Mock 数据接口定义
export interface MockUser {
  id: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  nickname?: string;
  realName?: string;
  gender?: Gender;
  birthday?: Date;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: Date;
  roles: string[];
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MockRole {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: RoleType;
  status: RoleStatus;
  sort: number;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MockPermission {
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
  children?: MockPermission[];
}

@Injectable()
export class MockDataService {
  private users: MockUser[] = [];
  private roles: MockRole[] = [];
  private permissions: MockPermission[] = [];
  private initialized = false;

  constructor() {
    this.initializeData();
  }

  // 初始化所有 mock 数据
  async initializeData() {
    if (this.initialized) return;

    await this.initializePermissions();
    await this.initializeRoles();
    await this.initializeUsers();

    this.initialized = true;
  }

  // 重置所有数据
  async resetData() {
    this.users = [];
    this.roles = [];
    this.permissions = [];
    this.initialized = false;
    await this.initializeData();
  }

  // 获取用户数据
  getUsers(): MockUser[] {
    return [...this.users];
  }

  // 获取角色数据
  getRoles(): MockRole[] {
    return [...this.roles];
  }

  // 获取权限数据
  getPermissions(): MockPermission[] {
    return [...this.permissions];
  }

  // 添加用户
  addUser(user: MockUser): void {
    this.users.push(user);
  }

  // 更新用户
  updateUser(id: string, updates: Partial<MockUser>): MockUser | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.users[index];
  }

  // 删除用户
  removeUser(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }

  // 添加角色
  addRole(role: MockRole): void {
    this.roles.push(role);
  }

  // 更新角色
  updateRole(id: string, updates: Partial<MockRole>): MockRole | null {
    const index = this.roles.findIndex((r) => r.id === id);
    if (index === -1) return null;

    this.roles[index] = {
      ...this.roles[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.roles[index];
  }

  // 删除角色
  removeRole(id: string): boolean {
    const index = this.roles.findIndex((r) => r.id === id);
    if (index === -1) return false;

    this.roles.splice(index, 1);
    return true;
  }

  // 添加权限
  addPermission(permission: MockPermission): void {
    this.permissions.push(permission);
  }

  // 更新权限
  updatePermission(
    id: string,
    updates: Partial<MockPermission>,
  ): MockPermission | null {
    const index = this.permissions.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.permissions[index] = {
      ...this.permissions[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.permissions[index];
  }

  // 删除权限
  removePermission(id: string): boolean {
    const index = this.permissions.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.permissions.splice(index, 1);
    return true;
  }

  // 根据角色代码获取用户数量
  getUserCountByRole(roleCode: string): number {
    return this.users.filter((user) => user.roles.includes(roleCode)).length;
  }

  // 根据用户ID获取用户权限
  getUserPermissions(userId: string): string[] {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return [];

    const userPermissions = new Set<string>();

    // 添加用户直接权限
    user.permissions.forEach((permission) => userPermissions.add(permission));

    // 添加角色权限
    user.roles.forEach((roleCode) => {
      const role = this.roles.find((r) => r.code === roleCode);
      if (role) {
        role.permissions.forEach((permission) =>
          userPermissions.add(permission),
        );
      }
    });

    return Array.from(userPermissions);
  }

  // 构建权限树
  buildPermissionTree(permissions?: MockPermission[]): MockPermission[] {
    const perms = permissions || this.permissions;
    const tree: MockPermission[] = [];
    const map = new Map<string, MockPermission>();

    // 创建映射
    perms.forEach((permission) => {
      map.set(permission.id, { ...permission, children: [] });
    });

    // 构建树结构
    perms.forEach((permission) => {
      const node = map.get(permission.id)!;
      if (permission.parentId) {
        const parent = map.get(permission.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    // 排序
    const sortTree = (nodes: MockPermission[]) => {
      nodes.sort((a, b) => a.sort - b.sort);
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          sortTree(node.children);
        }
      });
    };

    sortTree(tree);
    return tree;
  }

  // 初始化权限数据
  private async initializePermissions() {
    this.permissions = [
      // 系统管理
      {
        id: '1',
        name: '系统管理',
        code: 'system',
        type: PermissionType.MENU,
        path: '/system',
        component: 'Layout',
        icon: 'system',
        sort: 1,
        status: PermissionStatus.ACTIVE,
        description: '系统管理模块',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },

      // 用户管理
      {
        id: '2',
        name: '用户管理',
        code: 'user-management',
        type: PermissionType.MENU,
        parentId: '1',
        path: '/system/user',
        component: 'views/system/user/index',
        icon: 'user',
        sort: 1,
        status: PermissionStatus.ACTIVE,
        description: '用户管理页面',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '3',
        name: '查看用户',
        code: 'user:view',
        type: PermissionType.API,
        parentId: '2',
        sort: 1,
        status: PermissionStatus.ACTIVE,
        description: '查看用户列表和详情',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '4',
        name: '创建用户',
        code: 'user:create',
        type: PermissionType.BUTTON,
        parentId: '2',
        sort: 2,
        status: PermissionStatus.ACTIVE,
        description: '创建新用户',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '5',
        name: '编辑用户',
        code: 'user:update',
        type: PermissionType.BUTTON,
        parentId: '2',
        sort: 3,
        status: PermissionStatus.ACTIVE,
        description: '编辑用户信息',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '6',
        name: '删除用户',
        code: 'user:delete',
        type: PermissionType.BUTTON,
        parentId: '2',
        sort: 4,
        status: PermissionStatus.ACTIVE,
        description: '删除用户',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },

      // 角色管理
      {
        id: '7',
        name: '角色管理',
        code: 'role-management',
        type: PermissionType.MENU,
        parentId: '1',
        path: '/system/role',
        component: 'views/system/role/index',
        icon: 'role',
        sort: 2,
        status: PermissionStatus.ACTIVE,
        description: '角色管理页面',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '8',
        name: '查看角色',
        code: 'role:view',
        type: PermissionType.API,
        parentId: '7',
        sort: 1,
        status: PermissionStatus.ACTIVE,
        description: '查看角色列表和详情',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '9',
        name: '创建角色',
        code: 'role:create',
        type: PermissionType.BUTTON,
        parentId: '7',
        sort: 2,
        status: PermissionStatus.ACTIVE,
        description: '创建新角色',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '10',
        name: '编辑角色',
        code: 'role:update',
        type: PermissionType.BUTTON,
        parentId: '7',
        sort: 3,
        status: PermissionStatus.ACTIVE,
        description: '编辑角色信息',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '11',
        name: '删除角色',
        code: 'role:delete',
        type: PermissionType.BUTTON,
        parentId: '7',
        sort: 4,
        status: PermissionStatus.ACTIVE,
        description: '删除角色',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },

      // 权限管理
      {
        id: '12',
        name: '权限管理',
        code: 'permission-management',
        type: PermissionType.MENU,
        parentId: '1',
        path: '/system/permission',
        component: 'views/system/permission/index',
        icon: 'permission',
        sort: 3,
        status: PermissionStatus.ACTIVE,
        description: '权限管理页面',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '13',
        name: '查看权限',
        code: 'permission:view',
        type: PermissionType.API,
        parentId: '12',
        sort: 1,
        status: PermissionStatus.ACTIVE,
        description: '查看权限列表和详情',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '14',
        name: '创建权限',
        code: 'permission:create',
        type: PermissionType.BUTTON,
        parentId: '12',
        sort: 2,
        status: PermissionStatus.ACTIVE,
        description: '创建新权限',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '15',
        name: '编辑权限',
        code: 'permission:update',
        type: PermissionType.BUTTON,
        parentId: '12',
        sort: 3,
        status: PermissionStatus.ACTIVE,
        description: '编辑权限信息',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '16',
        name: '删除权限',
        code: 'permission:delete',
        type: PermissionType.BUTTON,
        parentId: '12',
        sort: 4,
        status: PermissionStatus.ACTIVE,
        description: '删除权限',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },

      // 仪表盘
      {
        id: '17',
        name: '仪表盘',
        code: 'dashboard',
        type: PermissionType.MENU,
        path: '/dashboard',
        component: 'views/dashboard/index',
        icon: 'dashboard',
        sort: 0,
        status: PermissionStatus.ACTIVE,
        description: '系统仪表盘',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },

      // 内容管理
      {
        id: '18',
        name: '内容管理',
        code: 'content',
        type: PermissionType.MENU,
        path: '/content',
        component: 'Layout',
        icon: 'content',
        sort: 2,
        status: PermissionStatus.ACTIVE,
        description: '内容管理模块',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '19',
        name: '文章管理',
        code: 'article-management',
        type: PermissionType.MENU,
        parentId: '18',
        path: '/content/article',
        component: 'views/content/article/index',
        icon: 'article',
        sort: 1,
        status: PermissionStatus.ACTIVE,
        description: '文章管理页面',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '20',
        name: '查看文章',
        code: 'article:view',
        type: PermissionType.API,
        parentId: '19',
        sort: 1,
        status: PermissionStatus.ACTIVE,
        description: '查看文章列表和详情',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '21',
        name: '创建文章',
        code: 'article:create',
        type: PermissionType.BUTTON,
        parentId: '19',
        sort: 2,
        status: PermissionStatus.ACTIVE,
        description: '创建新文章',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '22',
        name: '编辑文章',
        code: 'article:update',
        type: PermissionType.BUTTON,
        parentId: '19',
        sort: 3,
        status: PermissionStatus.ACTIVE,
        description: '编辑文章内容',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '23',
        name: '删除文章',
        code: 'article:delete',
        type: PermissionType.BUTTON,
        parentId: '19',
        sort: 4,
        status: PermissionStatus.ACTIVE,
        description: '删除文章',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '24',
        name: '发布文章',
        code: 'article:publish',
        type: PermissionType.BUTTON,
        parentId: '19',
        sort: 5,
        status: PermissionStatus.ACTIVE,
        description: '发布或下架文章',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },

      // 系统设置
      {
        id: '25',
        name: '系统设置',
        code: 'system-config',
        type: PermissionType.MENU,
        parentId: '1',
        path: '/system/config',
        component: 'views/system/config/index',
        icon: 'config',
        sort: 4,
        status: PermissionStatus.ACTIVE,
        description: '系统配置页面',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '26',
        name: '查看配置',
        code: 'config:view',
        type: PermissionType.API,
        parentId: '25',
        sort: 1,
        status: PermissionStatus.ACTIVE,
        description: '查看系统配置',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '27',
        name: '修改配置',
        code: 'config:update',
        type: PermissionType.BUTTON,
        parentId: '25',
        sort: 2,
        status: PermissionStatus.ACTIVE,
        description: '修改系统配置',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },

      // 系统日志
      {
        id: '28',
        name: '系统日志',
        code: 'system-log',
        type: PermissionType.MENU,
        parentId: '1',
        path: '/system/log',
        component: 'views/system/log/index',
        icon: 'log',
        sort: 5,
        status: PermissionStatus.ACTIVE,
        description: '系统日志页面',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '29',
        name: '查看日志',
        code: 'log:view',
        type: PermissionType.API,
        parentId: '28',
        sort: 1,
        status: PermissionStatus.ACTIVE,
        description: '查看系统日志',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '30',
        name: '清理日志',
        code: 'log:clear',
        type: PermissionType.BUTTON,
        parentId: '28',
        sort: 2,
        status: PermissionStatus.ACTIVE,
        description: '清理系统日志',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
    ];
  }

  // 初始化角色数据
  private async initializeRoles() {
    this.roles = [
      {
        id: '1',
        name: '超级管理员',
        code: 'super_admin',
        description: '系统超级管理员，拥有所有权限',
        type: RoleType.SYSTEM,
        status: RoleStatus.ACTIVE,
        sort: 1,
        permissions: [
          'dashboard',
          'user:view',
          'user:create',
          'user:update',
          'user:delete',
          'role:view',
          'role:create',
          'role:update',
          'role:delete',
          'permission:view',
          'permission:create',
          'permission:update',
          'permission:delete',
          'article:view',
          'article:create',
          'article:update',
          'article:delete',
          'article:publish',
          'config:view',
          'config:update',
          'log:view',
          'log:clear',
        ],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '2',
        name: '系统管理员',
        code: 'admin',
        description: '系统管理员，拥有大部分管理权限',
        type: RoleType.SYSTEM,
        status: RoleStatus.ACTIVE,
        sort: 2,
        permissions: [
          'dashboard',
          'user:view',
          'user:create',
          'user:update',
          'user:delete',
          'role:view',
          'permission:view',
          'article:view',
          'article:create',
          'article:update',
          'article:delete',
          'article:publish',
          'config:view',
          'log:view',
        ],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '3',
        name: '内容管理员',
        code: 'content_admin',
        description: '内容管理员，负责内容相关的管理工作',
        type: RoleType.CUSTOM,
        status: RoleStatus.ACTIVE,
        sort: 3,
        permissions: [
          'dashboard',
          'article:view',
          'article:create',
          'article:update',
          'article:delete',
          'article:publish',
        ],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '4',
        name: '内容编辑',
        code: 'editor',
        description: '内容编辑，可以创建和编辑内容',
        type: RoleType.CUSTOM,
        status: RoleStatus.ACTIVE,
        sort: 4,
        permissions: [
          'dashboard',
          'article:view',
          'article:create',
          'article:update',
        ],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '5',
        name: '普通用户',
        code: 'user',
        description: '普通用户，只有基本的查看权限',
        type: RoleType.SYSTEM,
        status: RoleStatus.ACTIVE,
        sort: 5,
        permissions: ['dashboard', 'article:view'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '6',
        name: '审核员',
        code: 'reviewer',
        description: '审核员，负责内容审核工作',
        type: RoleType.CUSTOM,
        status: RoleStatus.ACTIVE,
        sort: 6,
        permissions: [
          'dashboard',
          'article:view',
          'article:update',
          'article:publish',
        ],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '7',
        name: '访客',
        code: 'guest',
        description: '访客角色，仅有最基本的查看权限',
        type: RoleType.SYSTEM,
        status: RoleStatus.ACTIVE,
        sort: 7,
        permissions: ['dashboard'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '8',
        name: '测试角色',
        code: 'test_role',
        description: '测试用角色，用于功能测试',
        type: RoleType.CUSTOM,
        status: RoleStatus.INACTIVE,
        sort: 8,
        permissions: ['dashboard', 'user:view'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
    ];
  }

  // 初始化用户数据
  private async initializeUsers() {
    // 预设密码哈希值 (password: "password123")
    const defaultPasswordHash =
      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

    this.users = [
      {
        id: '1',
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: defaultPasswordHash,
        phone: '13800000001',
        avatar: '/assets/avatars/superadmin.jpg',
        nickname: '超级管理员',
        realName: '系统管理员',
        gender: Gender.OTHER,
        birthday: new Date('1990-01-01'),
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: new Date(),
        roles: ['super_admin'],
        permissions: [],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date(),
      },
      {
        id: '2',
        username: 'admin',
        email: 'admin@example.com',
        password: defaultPasswordHash,
        phone: '13800000002',
        avatar: '/assets/avatars/admin.jpg',
        nickname: '管理员',
        realName: '张三',
        gender: Gender.MALE,
        birthday: new Date('1985-05-15'),
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
        roles: ['admin'],
        permissions: [],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date(),
      },
      {
        id: '3',
        username: 'contentadmin',
        email: 'contentadmin@example.com',
        password: defaultPasswordHash,
        phone: '13800000003',
        avatar: '/assets/avatars/contentadmin.jpg',
        nickname: '内容管理员',
        realName: '李四',
        gender: Gender.FEMALE,
        birthday: new Date('1992-08-20'),
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
        roles: ['content_admin'],
        permissions: [],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date(),
      },
      {
        id: '4',
        username: 'editor1',
        email: 'editor1@example.com',
        password: defaultPasswordHash,
        phone: '13800000004',
        avatar: '/assets/avatars/editor1.jpg',
        nickname: '编辑小王',
        realName: '王五',
        gender: Gender.MALE,
        birthday: new Date('1995-03-10'),
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3小时前
        roles: ['editor'],
        permissions: [],
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date(),
      },
      {
        id: '5',
        username: 'editor2',
        email: 'editor2@example.com',
        password: defaultPasswordHash,
        phone: '13800000005',
        nickname: '编辑小赵',
        realName: '赵六',
        gender: Gender.FEMALE,
        birthday: new Date('1993-12-05'),
        status: UserStatus.ACTIVE,
        emailVerified: false,
        lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7天前
        roles: ['editor'],
        permissions: [],
        createdAt: new Date('2023-02-15'),
        updatedAt: new Date(),
      },
      {
        id: '6',
        username: 'reviewer',
        email: 'reviewer@example.com',
        password: defaultPasswordHash,
        phone: '13800000006',
        avatar: '/assets/avatars/reviewer.jpg',
        nickname: '审核员',
        realName: '孙七',
        gender: Gender.MALE,
        birthday: new Date('1988-07-25'),
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12小时前
        roles: ['reviewer'],
        permissions: [],
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date(),
      },
      {
        id: '7',
        username: 'user1',
        email: 'user1@example.com',
        password: defaultPasswordHash,
        phone: '13800000007',
        nickname: '普通用户1',
        realName: '周八',
        gender: Gender.FEMALE,
        birthday: new Date('1996-11-18'),
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
        roles: ['user'],
        permissions: [],
        createdAt: new Date('2023-03-15'),
        updatedAt: new Date(),
      },
      {
        id: '8',
        username: 'user2',
        email: 'user2@example.com',
        password: defaultPasswordHash,
        nickname: '普通用户2',
        realName: '吴九',
        gender: Gender.MALE,
        status: UserStatus.INACTIVE,
        emailVerified: false,
        roles: ['user'],
        permissions: [],
        createdAt: new Date('2023-04-01'),
        updatedAt: new Date(),
      },
      {
        id: '9',
        username: 'testuser1',
        email: 'testuser1@example.com',
        password: defaultPasswordHash,
        phone: '13800000009',
        nickname: '测试用户1',
        realName: '测试一',
        gender: Gender.MALE,
        birthday: new Date('1994-06-12'),
        status: UserStatus.PENDING,
        emailVerified: false,
        roles: ['user'],
        permissions: [],
        createdAt: new Date('2023-04-15'),
        updatedAt: new Date(),
      },
      {
        id: '10',
        username: 'banneduser',
        email: 'banneduser@example.com',
        password: defaultPasswordHash,
        nickname: '被封用户',
        realName: '被封测试',
        gender: Gender.FEMALE,
        status: UserStatus.BANNED,
        emailVerified: true,
        lastLoginAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
        roles: ['user'],
        permissions: [],
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date(),
      },
      {
        id: '11',
        username: 'multiuser',
        email: 'multiuser@example.com',
        password: defaultPasswordHash,
        phone: '13800000011',
        avatar: '/assets/avatars/multiuser.jpg',
        nickname: '多角色用户',
        realName: '多角色测试',
        gender: Gender.OTHER,
        birthday: new Date('1991-09-30'),
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6小时前
        roles: ['editor', 'reviewer'],
        permissions: ['user:view'], // 额外的直接权限
        createdAt: new Date('2023-03-20'),
        updatedAt: new Date(),
      },
      {
        id: '12',
        username: 'guest',
        email: 'guest@example.com',
        password: defaultPasswordHash,
        nickname: '访客用户',
        status: UserStatus.ACTIVE,
        emailVerified: false,
        roles: ['guest'],
        permissions: [],
        createdAt: new Date('2023-05-01'),
        updatedAt: new Date(),
      },
    ];
  }
}
