import { NotificationService } from './notification.service';
import { TestBed } from '@suites/unit';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const { unit } = await TestBed.solitary(NotificationService).compile();

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
