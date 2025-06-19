import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { MockDataService } from '../../common/mock/mock-data.service';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, MockDataService],
  exports: [PermissionService],
})
export class PermissionModule {}
