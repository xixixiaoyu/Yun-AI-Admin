import { Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MockService } from './mock.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Mock 数据管理')
@Controller('mock')
export class MockController {
  constructor(private readonly mockService: MockService) {}

  @Public()
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '重置所有 Mock 数据' })
  @ApiResponse({ status: 200, description: '数据重置成功' })
  async resetData() {
    await this.mockService.resetAllData();
    return {
      success: true,
      message: '所有 Mock 数据已重置',
    };
  }

  @Public()
  @Get('status')
  @ApiOperation({ summary: '获取 Mock 数据状态' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getStatus() {
    const status = await this.mockService.getDataStatus();
    return {
      success: true,
      data: status,
      message: '获取成功',
    };
  }

  @Public()
  @Post('init')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '初始化 Mock 数据' })
  @ApiResponse({ status: 200, description: '数据初始化成功' })
  async initData() {
    await this.mockService.initializeData();
    return {
      success: true,
      message: 'Mock 数据初始化完成',
    };
  }

  @Public()
  @Get('users/count')
  @ApiOperation({ summary: '获取用户数量统计' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getUsersCount() {
    const count = await this.mockService.getUsersCount();
    return {
      success: true,
      data: count,
      message: '获取成功',
    };
  }

  @Public()
  @Get('roles/count')
  @ApiOperation({ summary: '获取角色数量统计' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getRolesCount() {
    const count = await this.mockService.getRolesCount();
    return {
      success: true,
      data: count,
      message: '获取成功',
    };
  }

  @Public()
  @Get('permissions/count')
  @ApiOperation({ summary: '获取权限数量统计' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getPermissionsCount() {
    const count = await this.mockService.getPermissionsCount();
    return {
      success: true,
      data: count,
      message: '获取成功',
    };
  }
}
