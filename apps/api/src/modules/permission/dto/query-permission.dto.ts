import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  PermissionType,
  PermissionStatus,
} from '../../../common/mock/mock-data.service';

export class QueryPermissionDto {
  @ApiProperty({ description: '关键词搜索', example: '用户', required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    description: '权限类型',
    enum: PermissionType,
    required: false,
  })
  @IsOptional()
  @IsEnum(PermissionType)
  type?: PermissionType;

  @ApiProperty({
    description: '权限状态',
    enum: PermissionStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PermissionStatus)
  status?: PermissionStatus;

  @ApiProperty({ description: '父级权限ID', example: '1', required: false })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({
    description: '是否返回树形结构',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsString()
  tree?: string;
}
