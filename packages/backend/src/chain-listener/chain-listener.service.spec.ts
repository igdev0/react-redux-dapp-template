import { ChainListenerService } from './chain-listener.service';
import { TestBed } from '@suites/unit';

describe('ChainListenerService', () => {
  let service: ChainListenerService;

  beforeEach(async () => {
    const { unit } = await TestBed.solitary(ChainListenerService).compile();

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
