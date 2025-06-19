# 后端开发指南

## 概述

本文档详细介绍了后端项目的开发规范、架构设计和最佳实践。

## 技术栈

### 核心框架
- **NestJS**: 渐进式 Node.js 框架
- **TypeScript**: 类型安全的 JavaScript 超集
- **Express**: 底层 HTTP 服务器

### 数据库和缓存
- **TypeORM**: 对象关系映射 (ORM)
- **PostgreSQL**: 主数据库
- **Redis**: 缓存和会话存储

### 认证和安全
- **Passport**: 认证中间件
- **JWT**: JSON Web Token
- **bcryptjs**: 密码加密

### 文档和测试
- **Swagger**: API 文档生成
- **Jest**: 单元测试框架

## 项目结构

```
apps/api/
├── src/
│   ├── modules/            # 业务模块
│   │   ├── auth/           # 认证模块
│   │   │   ├── dto/        # 数据传输对象
│   │   │   ├── guards/     # 守卫
│   │   │   ├── strategies/ # 认证策略
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── user/           # 用户管理
│   │   ├── role/           # 角色管理
│   │   └── permission/     # 权限管理
│   ├── common/             # 公共模块
│   │   ├── decorators/     # 装饰器
│   │   ├── filters/        # 异常过滤器
│   │   ├── guards/         # 守卫
│   │   ├── interceptors/   # 拦截器
│   │   └── pipes/          # 管道
│   ├── config/             # 配置文件
│   ├── database/           # 数据库相关
│   │   ├── entities/       # 实体定义
│   │   └── migrations/     # 数据库迁移
│   ├── shared/             # 共享模块
│   ├── app.controller.ts   # 应用控制器
│   ├── app.module.ts       # 应用模块
│   ├── app.service.ts      # 应用服务
│   └── main.ts             # 应用入口
├── test/                   # 测试文件
├── nest-cli.json           # NestJS CLI 配置
├── package.json            # 依赖配置
└── tsconfig.json           # TypeScript 配置
```

## 开发规范

### 模块开发

#### 1. 模块结构
每个业务模块应包含以下文件：
```
module-name/
├── dto/                    # 数据传输对象
│   ├── create-xxx.dto.ts
│   ├── update-xxx.dto.ts
│   └── query-xxx.dto.ts
├── entities/               # 实体定义（可选）
├── xxx.controller.ts       # 控制器
├── xxx.service.ts          # 服务
├── xxx.module.ts           # 模块
└── xxx.spec.ts             # 测试文件
```

#### 2. 控制器开发
```typescript
// user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('用户管理')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Permissions('user:create')
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '用户创建成功' })
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);
    return {
      success: true,
      data: result,
      message: '用户创建成功',
    };
  }

  @Get()
  @Permissions('user:view')
  @ApiOperation({ summary: '获取用户列表' })
  async findAll(@Query() queryDto: QueryUserDto) {
    const result = await this.userService.findAll(queryDto);
    return {
      success: true,
      data: result,
      message: '获取成功',
    };
  }

  @Get(':id')
  @Permissions('user:view')
  @ApiOperation({ summary: '获取用户详情' })
  async findOne(@Param('id') id: string) {
    const result = await this.userService.findOne(id);
    return {
      success: true,
      data: result,
      message: '获取成功',
    };
  }

  @Patch(':id')
  @Permissions('user:update')
  @ApiOperation({ summary: '更新用户信息' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.userService.update(id, updateUserDto);
    return {
      success: true,
      data: result,
      message: '更新成功',
    };
  }

  @Delete(':id')
  @Permissions('user:delete')
  @ApiOperation({ summary: '删除用户' })
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return {
      success: true,
      message: '删除成功',
    };
  }
}
```

#### 3. 服务开发
```typescript
// user.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    
    if (existingEmail) {
      throw new ConflictException('邮箱已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 创建用户
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    
    // 移除密码字段
    const { password, ...result } = savedUser;
    return result as User;
  }

  async findAll(queryDto: QueryUserDto) {
    const { page = 1, limit = 10, keyword, status, roleId } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.nickname',
        'user.status',
        'user.createdAt',
        'role.id',
        'role.name',
        'role.code',
      ]);

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere(
        '(user.username ILIKE :keyword OR user.email ILIKE :keyword OR user.nickname ILIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // 状态筛选
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    // 角色筛选
    if (roleId) {
      queryBuilder.andWhere('role.id = :roleId', { roleId });
    }

    // 分页
    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

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

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
      select: [
        'id',
        'username',
        'email',
        'nickname',
        'phone',
        'status',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // 检查用户名冲突
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      
      if (existingUser) {
        throw new ConflictException('用户名已存在');
      }
    }

    // 检查邮箱冲突
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      
      if (existingEmail) {
        throw new ConflictException('邮箱已存在');
      }
    }

    // 加密新密码
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // 更新用户
    await this.userRepository.update(id, updateUserDto);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    
    // 不允许删除管理员账户
    if (user.username === 'admin') {
      throw new ConflictException('不能删除管理员账户');
    }

    await this.userRepository.delete(id);
  }
}
```

### DTO 开发

#### 1. 创建 DTO
```typescript
// dto/create-user.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus, Gender } from '@admin-system/shared';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'newuser' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({ description: '邮箱', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '密码', example: 'Password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: '昵称', example: '新用户', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @ApiProperty({ description: '手机号', example: '13800138000', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '性别', enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ description: '用户状态', enum: UserStatus, required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
```

#### 2. 更新 DTO
```typescript
// dto/update-user.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

#### 3. 查询 DTO
```typescript
// dto/query-user.dto.ts
import { IsOptional, IsString, IsEnum, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@admin-system/shared';

export class QueryUserDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiProperty({ description: '搜索关键词', required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ description: '用户状态', enum: UserStatus, required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
```

### 实体开发

```typescript
// entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserStatus, Gender } from '@admin-system/shared';
import { Role } from '../role/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ length: 50, nullable: true })
  nickname?: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
```

### 认证和授权

#### 1. JWT 策略
```typescript
// auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }
    return user;
  }
}
```

#### 2. 权限守卫
```typescript
// common/guards/permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    return requiredPermissions.some((permission) =>
      user.permissions?.includes(permission),
    );
  }
}
```

#### 3. 权限装饰器
```typescript
// common/decorators/permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
```

### 异常处理

#### 1. 全局异常过滤器
```typescript
// common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      success: false,
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
    };

    response.status(status).json(errorResponse);
  }
}
```

### 拦截器

#### 1. 响应格式化拦截器
```typescript
// common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

### 配置管理

#### 1. 配置文件
```typescript
// config/database.config.ts
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'admin_system',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  }),
);
```

### 测试

#### 1. 单元测试
```typescript
// user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(createUserDto as any);
      jest.spyOn(repository, 'save').mockResolvedValue(createUserDto as any);

      const result = await service.create(createUserDto);
      expect(result).toBeDefined();
    });
  });
});
```

#### 2. 集成测试
```typescript
// user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## 最佳实践

### 1. 错误处理
- 使用适当的 HTTP 状态码
- 提供清晰的错误信息
- 记录详细的错误日志

### 2. 安全性
- 验证所有输入数据
- 使用强密码策略
- 实施 API 限流
- 启用 CORS 保护

### 3. 性能优化
- 使用数据库索引
- 实施缓存策略
- 优化查询语句
- 使用连接池

### 4. 代码质量
- 编写单元测试
- 使用 TypeScript 类型
- 遵循 SOLID 原则
- 保持代码简洁
