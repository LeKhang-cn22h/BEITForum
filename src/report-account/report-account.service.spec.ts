import { Test, TestingModule } from '@nestjs/testing';
import { ReportAccountService } from './report-account.service';

describe('ReportAccountService', () => {
  let service: ReportAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportAccountService],
    }).compile();

    service = module.get<ReportAccountService>(ReportAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
