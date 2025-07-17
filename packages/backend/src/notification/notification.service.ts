import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { NotificationI } from './notification.interface';
import { InjectRepository } from '@nestjs/typeorm';
import NotificationEntity from './entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  // A map to hold active SSE streams per connected user
  private userStreams = new Map<string, Subject<MessageEvent<NotificationI>>>();

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  /**
   * Establishes a new SSE stream for a user and stores it in memory.
   * Called when a client connects to the SSE endpoint.
   * @param userId - The user's ID
   * @returns A Subject stream to send MessageEvents to the user
   */
  connectUser(userId: string): Subject<MessageEvent<NotificationI>> {
    const stream = new Subject<MessageEvent<NotificationI>>();
    this.userStreams.set(userId, stream);
    return stream;
  }

  /**
   * Disconnects a user by completing their stream and removing it from memory.
   * Called when a client disconnects from the SSE endpoint.
   * @param userId - The user's ID
   */
  disconnectUser(userId: string) {
    const stream = this.userStreams.get(userId);
    if (stream) {
      stream.complete();
      this.userStreams.delete(userId);
    }
  }

  /**
   * Saves a new notification in the database and pushes it to the user's SSE stream if connected.
   * @param userId - The user to send the notification to
   * @param data - The notification payload (excluding id, created_at, updated_at)
   */
  async saveAndSend(
    userId: string,
    data: Omit<NotificationI, 'id' | 'created_at' | 'updated_at'>,
  ) {
    const stream = this.userStreams.get(userId);
    const entity = this.notificationRepository.create(data);
    const saved = await this.notificationRepository.save(entity);

    // Send the notification over SSE if the user is connected
    if (stream) {
      stream.next(new MessageEvent(data.type, { data: saved }));
    }
  }

  /**
   * Marks a notification as read in the database.
   * @param notificationId - The ID of the notification to update
   */
  async markAsRead(notificationId: string) {
    await this.notificationRepository.update(notificationId, {
      is_read: true,
    });
  }

  async getNotifications(userId: string) {
    return this.notificationRepository.find({
      where: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        userId,
      },
      relations: { user: true },
    });
  }
}
