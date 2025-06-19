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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { UserStatus } from '../../common/mock/mock-data.service';

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
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '用户名或邮箱已存在' })
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
  @ApiResponse({ status: 200, description: '获取成功' })
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
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
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
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 409, description: '用户名或邮箱已存在' })
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
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(id);
    return {
      success: true,
      data: result,
      message: '删除成功',
    };
  }

  @Post('batch-delete')
  @Permissions('user:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '批量删除用户' })
  @ApiResponse({ status: 200, description: '批量删除完成' })
  async batchDelete(@Body('ids') ids: string[]) {
    const result = await this.userService.batchDelete(ids);
    return {
      success: true,
      data: result,
      message: '批量删除完成',
    };
  }

  @Patch(':id/status')
  @Permissions('user:update')
  @ApiOperation({ summary: '更新用户状态' })
  @ApiResponse({ status: 200, description: '状态更新成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
  ) {
    const result = await this.userService.updateStatus(id, status);
    return {
      success: true,
      data: result,
      message: '状态更新成功',
    };
  }

  @Post(':id/roles')
  @Permissions('user:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '分配用户角色' })
  @ApiResponse({ status: 200, description: '角色分配成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async assignRoles(
    @Param('id') id: string,
    @Body('roleIds') roleIds: string[],
  ) {
    const result = await this.userService.assignRoles(id, roleIds);
    return {
      success: true,
      data: result,
      message: '角色分配成功',
    };
  }
}
