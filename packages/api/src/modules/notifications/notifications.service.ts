import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../common/prisma/prisma.service';
import axios from 'axios';

const UNIFONIC_API = 'https://el.cloud.unifonic.com/rest';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger('NotificationsService');
  private readonly unifonicAppSid: string;
  private readonly isProduction: boolean;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    @InjectQueue('notifications') private notificationQueue: Queue,
  ) {
    this.unifonicAppSid = this.config.get<string>('UNIFONIC_APP_SID') || '';
    this.isProduction = this.config.get('NODE_ENV') === 'production';
  }

  @OnEvent('booking.created')
  async handleBookingCreated(booking: any) {
    this.logger.log(`New booking notification: ${booking.bookingNumber}`);
    await this.createNotification(
      booking.customerId,
      'تم إنشاء حجزك',
      `رقم الحجز: ${booking.bookingNumber}`,
      'IN_APP',
    );
    // Send SMS to customer
    if (booking.customer?.phone) {
      await this.sendSms(
        booking.customer.phone,
        `كرفاني: تم إنشاء حجزك بنجاح. رقم الحجز: ${booking.bookingNumber}`,
      );
    }
  }

  @OnEvent('booking.cancelled')
  async handleBookingCancelled(booking: any) {
    this.logger.log(`Cancelled booking notification: ${booking.bookingNumber}`);
    await this.createNotification(
      booking.customerId,
      'تم إلغاء الحجز',
      `تم إلغاء الحجز رقم ${booking.bookingNumber}`,
      'IN_APP',
    );
  }

  @OnEvent('payment.completed')
  async handlePaymentCompleted(data: any) {
    this.logger.log(`Payment completed for booking: ${data.booking.bookingNumber}`);
    await this.createNotification(
      data.booking.customerId,
      'تم الدفع بنجاح',
      `تم تأكيد دفع الحجز رقم ${data.booking.bookingNumber}`,
      'IN_APP',
    );
  }

  @OnEvent('auth.userCreated')
  async handleUserCreated(user: any) {
    this.logger.log(`New user registered: ${user.phone}`);
    await this.sendSms(user.phone, 'مرحباً بك في كرفاني! نتمنى لك تجربة ممتعة.');
  }

  async sendSms(phone: string, message: string) {
    if (this.unifonicAppSid && this.isProduction) {
      return this.sendUnifonicSms(phone, message);
    }

    // Dev mode: queue for logging
    this.logger.log(`[SMS Dev] ${phone}: ${message}`);
    try {
      await this.notificationQueue.add('sms', { phone, message });
    } catch (error) {
      this.logger.warn(`Failed to queue SMS job: ${error}`);
    }
  }

  private async sendUnifonicSms(phone: string, message: string) {
    try {
      const response = await axios.post(`${UNIFONIC_API}/Messages/Send`, null, {
        params: {
          AppSid: this.unifonicAppSid,
          Recipient: phone.replace('+', ''),
          Body: message,
          SenderID: 'Karfani',
        },
      });

      if (response.data?.success) {
        this.logger.log(`SMS sent to ${phone}`);
      } else {
        this.logger.warn(`SMS failed to ${phone}: ${JSON.stringify(response.data)}`);
      }

      return response.data;
    } catch (error: any) {
      this.logger.error(`Unifonic SMS error: ${error.message}`);
      throw error;
    }
  }

  async sendWhatsApp(phone: string, templateName: string, params: Record<string, string>) {
    if (!this.unifonicAppSid || !this.isProduction) {
      this.logger.log(`[WhatsApp Dev] ${phone}: template=${templateName} params=${JSON.stringify(params)}`);
      return;
    }

    try {
      await axios.post(
        `${UNIFONIC_API}/WhatsApp/Send`,
        {
          AppSid: this.unifonicAppSid,
          Recipient: phone.replace('+', ''),
          TemplateName: templateName,
          Params: params,
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
      this.logger.log(`WhatsApp sent to ${phone}`);
    } catch (error: any) {
      this.logger.error(`Unifonic WhatsApp error: ${error.message}`);
    }
  }

  async sendEmail(to: string, subject: string, body: string) {
    try {
      await this.notificationQueue.add('email', { to, subject, body });
    } catch (error) {
      this.logger.warn(`Failed to queue email job: ${error}`);
    }
  }

  async getByUser(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { success: true, data: notifications };
  }

  async markRead(id: string, userId: string) {
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });
    return { success: true };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { success: true };
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
      this.logger.error(`Error creating notification: ${error}`);
    }
  }
}
