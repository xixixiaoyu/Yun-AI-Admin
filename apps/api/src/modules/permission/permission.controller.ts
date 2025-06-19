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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('权限管理')
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Permissions('permission:create')
  @ApiOperation({ summary: '创建权限' })
  @ApiResponse({ status: 201, description: '权限创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '权限代码已存在' })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const result = await this.permissionService.create(createPermissionDto);
    return {
      success: true,
      data: result,
      message: '权限创建成功',
    };
  }

  @Get()
  @Permissions('permission:view')
  @ApiOperation({ summary: '获取权限列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(@Query() queryDto: QueryPermissionDto) {
    const result = await this.permissionService.findAll(queryDto);
    return {
      success: true,
      data: result,
      message: '获取成功',
    };
  }

  @Get('tree')
  @Permissions('permission:view')
  @ApiOperation({ summary: '获取权限树' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getTree() {
    const result = await this.permissionService.getTree();
    return {
      success: true,
      data: result,
      message: '获取成功',
    };
  }

  @Get('menu-tree')
  @Permissions('permission:view')
  @ApiOperation({ summary: '获取菜单权限树' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getMenuTree() {
    const result = await this.permissionService.getMenuTree();
    return {
      success: true,
      data: result,
      message: '获取成功',
    };
  }

  @Get(':id')
  @Permissions('permission:view')
  @ApiOperation({ summary: '获取权限详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  async findOne(@Param('id') id: string) {
    const result = await this.permissionService.findOne(id);
    return {
      success: true,
      data: result,
      message: '获取成功',
    };
  }

  @Patch(':id')
  @Permissions('permission:update')
  @ApiOperation({ summary: '更新权限信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiResponse({ status: 409, description: '权限代码已存在' })
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const result = await this.permissionService.update(id, updatePermissionDto);
    return {
      success: true,
      data: result,
      message: '更新成功',
    };
  }

  @Delete(':id')
  @Permissions('permission:delete')
  @ApiOperation({ summary: '删除权限' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiResponse({ status: 409, description: '该权限下还有子权限，无法删除' })
  async remove(@Param('id') id: string) {
    const result = await this.permissionService.remove(id);
    return {
      success: true,
      data: result,
      message: '删除成功',
    };
  }
}
