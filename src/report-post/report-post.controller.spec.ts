import { Test, TestingModule } from '@nestjs/testing';
import { ReportPostController } from './report-post.controller';
import { ReportPostService } from './report-post.service';

describe('ReportPostController', () => {
  let controller: ReportPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportPostController],
      providers: [ReportPostService],
    }).compile();

    controller = module.get<ReportPostController>(ReportPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
