import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger('NotificationsService');

  constructor(
    private prisma: PrismaService,
    @InjectQueue('notifications') private notificationQueue: Queue,
  ) {}

  @OnEvent('booking.created')
  async handleBookingCreated(booking: any) {
    console.log(`[Notification] حجز جديد: ${booking.bookingNumber}`);
    await this.createNotification(booking.customerId, 'تم إنشاء حجزك', `رقم الحجز: ${booking.bookingNumber}`, 'IN_APP');
  }

  @OnEvent('booking.cancelled')
  async handleBookingCancelled(booking: any) {
    console.log(`[Notification] حجز ملغي: ${booking.bookingNumber}`);
    await this.createNotification(booking.customerId, 'تم إلغاء الحجز', `تم إلغاء الحجز رقم ${booking.bookingNumber}`, 'IN_APP');
  }

  @OnEvent('payment.completed')
  async handlePaymentCompleted(data: any) {
    console.log(`[Notification] دفع مكتمل للحجز: ${data.booking.bookingNumber}`);
    await this.createNotification(data.booking.customerId, 'تم الدفع بنجاح', `تم تأكيد دفع الحجز رقم ${data.booking.bookingNumber}`, 'IN_APP');
  }

  @OnEvent('auth.userCreated')
  async handleUserCreated(user: any) {
    console.log(`[Notification] مستخدم جديد: ${user.phone}`);
    await this.sendSms(user.phone, 'مرحباً بك في كرفاني! نتمنى لك تجربة ممتعة.');
  }

  async sendSms(phone: string, message: string) {
    try {
      await this.notificationQueue.add('sms', { phone, message });
    } catch (error) {
      this.logger.warn(`Failed to queue SMS job: ${error}`);
    }
  }

  async sendEmail(to: string, subject: string, body: string) {
    try {
      await this.notificationQueue.add('email', { to, subject, body });
    } catch (error) {
      this.logger.warn(`Failed to queue email job: ${error}`);
    }
  }

  private async createNotification(userId: string, title: string, body: string, channel: string) {
    try {
      await this.prisma.notification.create({
        data: {
          userId,
          channel: channel as any,
          title,
          body,
          sentAt: new Date(),
        },
      });
    } catch (error) {
      console.error('[Notification] Error creating notification:', error);
    }
  }
}
