import { Test, TestingModule } from '@nestjs/testing';
import { ChainListenerService } from './chain-listener.service';

describe('ChainListenerService', () => {
  let service: ChainListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChainListenerService],
    }).compile();

    service = module.get<ChainListenerService>(ChainListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
