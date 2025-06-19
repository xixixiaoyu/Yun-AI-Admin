import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MockDataService } from '../../common/mock/mock-data.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService, MockDataService],
  exports: [RoleService],
})
export class RoleModule {}
