import { Module } from '@nestjs/common';
import { MockService } from './mock.service';
import { MockController } from './mock.controller';
import { MockDataService } from '../../common/mock/mock-data.service';

@Module({
  controllers: [MockController],
  providers: [MockService, MockDataService],
  exports: [MockService],
})
export class MockModule {}
