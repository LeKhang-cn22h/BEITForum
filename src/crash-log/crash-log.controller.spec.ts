import { Test, TestingModule } from '@nestjs/testing';
import { CrashLogController } from './crash-log.controller';

describe('CrashLogController', () => {
  let controller: CrashLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrashLogController],
    }).compile();

    controller = module.get<CrashLogController>(CrashLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
