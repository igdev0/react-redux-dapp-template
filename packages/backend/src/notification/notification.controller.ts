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

// Defines a controller for handling notification-related endpoints
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // SSE (Server-Sent Events) endpoint for streaming real-time notifications to authenticated users
  @UseGuards(AuthGuard) // Ensures the user is authenticated
  @Sse()
  stream(@Req() req: any, @GetUser() user: User) {
    // Connects the user to the notification stream (returns an Observable)
    const stream$ = this.notificationService.connectUser(user.id);

    // Handles client disconnects (e.g., tab close or network interruption)
    // and removes the user from the stream to free up resources
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    req.on('close', () => {
      this.notificationService.disconnectUser(user.id);
    });

    return stream$; // Return the stream to the client
  }

  // GET endpoint to retrieve all notifications for the authenticated user
  @Get()
  @UseGuards(AuthGuard) // Protects the route with authentication
  getNotifications(@GetUser() user: User) {
    return this.notificationService.getNotifications(user.id);
  }

  // PATCH endpoint to mark a specific notification as read
  @Patch('id')
  @UseGuards(AuthGuard) // Ensures only authenticated users can access
  markAsRead(@Param('id') id: string, @GetUser() user: User) {
    return this.notificationService.markAsRead(id, user.id);
  }
}
