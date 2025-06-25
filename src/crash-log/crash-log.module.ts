import { Module } from '@nestjs/common';
import { CrashLogService } from './crash-log.service';
import { CrashLogController } from './crash-log.controller';

@Module({
  controllers: [CrashLogController],
  providers: [CrashLogService]
})
export class CrashLogModule {}
