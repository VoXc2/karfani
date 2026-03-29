import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('notifications')
export class NotificationProcessor {
  private readonly logger = new Logger('NotificationProcessor');

  @Process('sms')
  async handleSms(job: Job<{ phone: string; message: string }>) {
    this.logger.log(`Sending SMS to ${job.data.phone}: ${job.data.message}`);
    // In production: call Unifonic API
    // For now, just log
    return { success: true, phone: job.data.phone };
  }

  @Process('email')
  async handleEmail(job: Job<{ to: string; subject: string; html: string }>) {
    this.logger.log(`Sending email to ${job.data.to}: ${job.data.subject}`);
    // In production: use nodemailer or SES
    return { success: true, to: job.data.to };
  }

  @Process('push')
  async handlePush(job: Job<{ userId: string; title: string; body: string }>) {
    this.logger.log(`Push notification to ${job.data.userId}: ${job.data.title}`);
    return { success: true, userId: job.data.userId };
  }
}
