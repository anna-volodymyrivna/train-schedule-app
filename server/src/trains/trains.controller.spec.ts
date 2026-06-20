import { Test, TestingModule } from '@nestjs/testing';
import { TrainsController } from './trains.controller';
import { TrainsService } from './trains.service';

describe('TrainsController', () => {
  let controller: TrainsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainsController],
      providers: [TrainsService],
    }).compile();

    controller = module.get<TrainsController>(TrainsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
