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
import { RoleService } from './role.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('角色管理')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Permissions('role:create')
  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: 201, description: '角色创建成功' })
  async create(@Body() createRoleDto: any) {
    const result = await this.roleService.create(createRoleDto);
    return {
      success: true,
      data: result,
      message: '角色创建成功',
    };
  }

  @Get()
  @Permissions('role:view')
  @ApiOperation({ summary: '获取角色列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(@Query() query: any) {
    const result = await this.roleService.findAll(query);
    return {
      success: true,
      data: result,
      message: '获取成功',
    };
  }

  @Get('options')
  @Permissions('role:view')
  @ApiOperation({ summary: '获取角色选项' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getOptions() {
    const result = await this.roleService.getOptions();
    return {
      success: true,
      data: result,
      message: '获取成功',
    };
  }

  @Get(':id')
  @Permissions('role:view')
  @ApiOperation({ summary: '获取角色详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id') id: string) {
    const result = await this.roleService.findOne(id);
    return {
      success: true,
      data: result,
      message: '获取成功',
    };
  }

  @Patch(':id')
  @Permissions('role:update')
  @ApiOperation({ summary: '更新角色信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() updateRoleDto: any) {
    const result = await this.roleService.update(id, updateRoleDto);
    return {
      success: true,
      data: result,
      message: '更新成功',
    };
  }

  @Delete(':id')
  @Permissions('role:delete')
  @ApiOperation({ summary: '删除角色' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string) {
    const result = await this.roleService.remove(id);
    return {
      success: true,
      data: result,
      message: '删除成功',
    };
  }

  @Post(':id/permissions')
  @Permissions('role:update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '分配角色权限' })
  @ApiResponse({ status: 200, description: '权限分配成功' })
  async assignPermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    const result = await this.roleService.assignPermissions(id, permissionIds);
    return {
      success: true,
      data: result,
      message: '权限分配成功',
    };
  }
}
