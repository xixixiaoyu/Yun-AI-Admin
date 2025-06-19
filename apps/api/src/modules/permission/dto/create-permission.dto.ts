import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  PermissionType,
  PermissionStatus,
} from '../../../common/mock/mock-data.service';

export class CreatePermissionDto {
  @ApiProperty({ description: '权限名称', example: '用户管理' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '权限代码', example: 'user:view' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @ApiProperty({
    description: '权限类型',
    enum: PermissionType,
    example: PermissionType.MENU,
  })
  @IsEnum(PermissionType)
  type: PermissionType;

  @ApiProperty({ description: '父级权限ID', example: '1', required: false })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({ description: '路由路径', example: '/user', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  path?: string;

  @ApiProperty({
    description: '组件路径',
    example: 'views/user/index',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  component?: string;

  @ApiProperty({ description: '图标', example: 'user', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({ description: '排序', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiProperty({
    description: '状态',
    enum: PermissionStatus,
    example: PermissionStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(PermissionStatus)
  status?: PermissionStatus;

  @ApiProperty({
    description: '描述',
    example: '用户管理相关权限',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
