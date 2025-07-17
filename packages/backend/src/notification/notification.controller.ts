import {
  Controller,
  Get,
  Param,
  Patch,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GetUser } from '../user/user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Sse()
  stream(@Req() req: any, @GetUser() user: User) {
    const stream$ = this.notificationService.connectUser(user.id);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    req.on('close', () => {
      this.notificationService.disconnectUser(user.id);
    });

    return stream$;
  }

  @Get()
  @UseGuards(AuthGuard)
  getNotifications(@GetUser() user: User) {
    return this.notificationService.getNotifications(user.id);
  }

  @Patch('id')
  @UseGuards(AuthGuard)
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }
}
