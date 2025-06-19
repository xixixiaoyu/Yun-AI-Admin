import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MockDataService } from '../../common/mock/mock-data.service';

@Module({
  controllers: [UserController],
  providers: [UserService, MockDataService],
  exports: [UserService],
})
export class UserModule {}
