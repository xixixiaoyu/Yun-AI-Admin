import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../../../common/mock/mock-data.service';

export class QueryUserDto {
  @ApiProperty({ description: '页码', example: 1, required: false })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiProperty({ description: '每页数量', example: 10, required: false })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiProperty({ description: '搜索关键词', example: 'admin', required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ description: '用户状态', enum: UserStatus, required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({ description: '角色ID', example: 'role1', required: false })
  @IsOptional()
  @IsString()
  roleId?: string;

  @ApiProperty({
    description: '开始日期',
    example: '2023-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: '结束日期',
    example: '2023-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
