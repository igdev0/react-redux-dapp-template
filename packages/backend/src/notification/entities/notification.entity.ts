import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { NotificationType } from '../notification.interface';

@Entity('notification')
export default class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column({ type: 'text' })
  type: NotificationType;

  @Column({ type: 'boolean' })
  is_read: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: object;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
