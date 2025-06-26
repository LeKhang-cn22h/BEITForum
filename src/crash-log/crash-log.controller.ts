import { Body, Controller, Post } from '@nestjs/common';
import { CrashLogService } from './crash-log.service';

@Controller('analyzeCrash')
export class CrashLogController {
  constructor(private readonly crashLogService: CrashLogService) {}

  @Post()
  async analyze(@Body() body: { email: string; userId: string; error: string }) {
    return this.crashLogService.analyzeCrash(body);
  }
}
