import { Test, TestingModule } from '@nestjs/testing';
import { CrashLogService } from './crash-log.service';

describe('CrashLogService', () => {
  let service: CrashLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrashLogService],
    }).compile();

    service = module.get<CrashLogService>(CrashLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
