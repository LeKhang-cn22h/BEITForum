import { Test, TestingModule } from '@nestjs/testing';
import { ReportAccountController } from './report-account.controller';

describe('ReportAccountController', () => {
  let controller: ReportAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportAccountController],
    }).compile();

    controller = module.get<ReportAccountController>(ReportAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
