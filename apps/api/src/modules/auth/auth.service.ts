import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  MockDataService,
  UserStatus,
  Gender,
} from '../../common/mock/mock-data.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private mockDataService: MockDataService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const users = this.mockDataService.getUsers();
    const user = users.find((u) => u.username === username);
    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('账户已被禁用');
      }
      const { password: _, ...result } = user;
      // 获取用户的完整权限（包括角色权限）
      const permissions = this.mockDataService.getUserPermissions(user.id);
      return { ...result, permissions };
    }
    return null;
  }

  async validateUserById(userId: string): Promise<any> {
    const users = this.mockDataService.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user && user.status === UserStatus.ACTIVE) {
      const { password: _, ...result } = user;
      // 获取用户的完整权限（包括角色权限）
      const permissions = this.mockDataService.getUserPermissions(user.id);
      return { ...result, permissions };
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        nickname: user.nickname,
        roles: user.roles,
        permissions: user.permissions,
      },
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes
    };
  }

  async register(registerDto: RegisterDto) {
    // 检查密码确认
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('两次输入的密码不一致');
    }

    const users = this.mockDataService.getUsers();

    // 检查用户名是否已存在
    const existingUser = users.find((u) => u.username === registerDto.username);
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = users.find((u) => u.email === registerDto.email);
    if (existingEmail) {
      throw new ConflictException('邮箱已存在');
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = {
      id: String(users.length + 1),
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
      nickname: registerDto.nickname || registerDto.username,
      phone: registerDto.phone,
      status: UserStatus.ACTIVE,
      emailVerified: false,
      roles: ['user'],
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockDataService.addUser(newUser);

    // 自动登录
    return this.login({
      username: registerDto.username,
      password: registerDto.password,
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.validateUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      const newPayload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
      };

      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60,
      };
    } catch (error) {
      throw new UnauthorizedException('刷新令牌无效');
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.validateUserById(userId);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      nickname: user.nickname,
      phone: user.phone,
      status: user.status,
      roles: user.roles.map((role) => ({ code: role, name: role })),
      permissions: user.permissions.map((permission) => ({
        code: permission,
        name: permission,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
