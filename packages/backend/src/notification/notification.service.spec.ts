import { NotificationService } from './notification.service';
import { Mocked, TestBed } from '@suites/unit';
import { Repository } from 'typeorm';
import NotificationEntity from './entities/notification.entity';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: Mocked<Repository<NotificationEntity>>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(NotificationService).compile();

    service = unit;
    notificationRepository = unitRef.get('NotificationEntityRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(notificationRepository).toBeDefined();
  });
});
