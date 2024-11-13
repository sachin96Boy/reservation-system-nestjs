import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  async notifyEmail({ email, text }: NotifyEmailDto) {
    console.log(`Notification sent to ${email}: ${text}`);
  }
}
