import { Test, TestingModule } from '@nestjs/testing';
import { ReportPostService } from './report-post.service';

describe('ReportPostService', () => {
  let service: ReportPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportPostService],
    }).compile();

    service = module.get<ReportPostService>(ReportPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
