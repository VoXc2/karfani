import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

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
    // TODO: Send welcome SMS via Unifonic
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
