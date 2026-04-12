import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';
import axios from 'axios';
import * as crypto from 'crypto';

const MOYASAR_API = 'https://api.moyasar.com/v1';

interface MoyasarPaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  source: { type: string; company: string; number: string };
  callback_url: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger('PaymentsService');
  private readonly apiKey: string;
  private readonly webhookSecret: string;
  private readonly isProduction: boolean;

  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
    private config: ConfigService,
  ) {
    this.apiKey = this.config.get<string>('MOYASAR_API_KEY') || '';
    this.webhookSecret = this.config.get<string>('MOYASAR_WEBHOOK_SECRET') || '';
    this.isProduction = this.config.get('NODE_ENV') === 'production';
  }

  async initiatePayment(bookingId: string, method: string, callbackUrl?: string) {
    const booking = await this.prisma.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (booking.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException('الحجز ليس بانتظار الدفع');
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        type: 'BOOKING_PAYMENT',
        amount: booking.totalPrice,
        method,
        status: 'PROCESSING',
      },
    });

    // Use Moyasar API in production, simulate in dev
    if (this.apiKey && this.isProduction) {
      return this.processMoyasarPayment(payment, booking, method, callbackUrl);
    }

    return this.simulatePayment(payment, booking, method);
  }

  private async processMoyasarPayment(
    payment: any,
    booking: any,
    method: string,
    callbackUrl?: string,
  ) {
    try {
      const amountInHalala = Math.round(Number(booking.totalPrice) * 100);

      const response = await axios.post<MoyasarPaymentResponse>(
        `${MOYASAR_API}/payments`,
        {
          amount: amountInHalala,
          currency: 'SAR',
          description: `حجز كرفاني رقم ${booking.bookingNumber}`,
          callback_url: callbackUrl || `${this.config.get('WEB_URL')}/checkout/callback`,
          source: { type: method === 'applepay' ? 'applepay' : 'creditcard' },
          metadata: {
            booking_id: booking.id,
            payment_id: payment.id,
            booking_number: booking.bookingNumber,
          },
        },
        {
          auth: { username: this.apiKey, password: '' },
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const moyasarPayment = response.data;

      // Update payment with gateway info
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { gatewayId: moyasarPayment.id },
      });

      this.logger.log(`Moyasar payment created: ${moyasarPayment.id} for booking ${booking.bookingNumber}`);

      return {
        success: true,
        data: {
          paymentId: payment.id,
          gatewayId: moyasarPayment.id,
          status: moyasarPayment.status,
          redirectUrl: (moyasarPayment as any).source?.transaction_url,
        },
      };
    } catch (error: any) {
      this.logger.error(`Moyasar payment failed: ${error.message}`);
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });
      throw new BadRequestException('فشل في إنشاء عملية الدفع. يرجى المحاولة مرة أخرى.');
    }
  }

  private async simulatePayment(payment: any, booking: any, method: string) {
    // Dev mode: simulate successful payment
    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED', paidAt: new Date(), gatewayId: `sim_${Date.now()}` },
    });

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED' },
    });

    // Create security deposit record
    await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        type: 'SECURITY_DEPOSIT',
        amount: booking.securityDeposit,
        method,
        status: 'COMPLETED',
        paidAt: new Date(),
      },
    });

    this.events.emit('payment.completed', { payment: updated, booking });
    return { success: true, data: updated };
  }

  async handleWebhook(body: any, signature?: string) {
    // Verify webhook signature in production
    if (this.webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(JSON.stringify(body))
        .digest('hex');

      if (signature !== expectedSignature) {
        this.logger.warn('Invalid Moyasar webhook signature');
        throw new BadRequestException('Invalid webhook signature');
      }
    }

    const { id, status, metadata } = body;
    if (!id || !metadata?.payment_id) {
      return { success: false, message: 'Missing payment data' };
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id: metadata.payment_id },
    });

    if (!payment) {
      this.logger.warn(`Payment not found for webhook: ${metadata.payment_id}`);
      return { success: false, message: 'Payment not found' };
    }

    if (status === 'paid') {
      const updated = await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED', paidAt: new Date(), gatewayId: id },
      });

      const booking = await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CONFIRMED' },
      });

      // Create security deposit
      await this.prisma.payment.create({
        data: {
          bookingId: payment.bookingId,
          type: 'SECURITY_DEPOSIT',
          amount: booking.securityDeposit,
          method: payment.method,
          status: 'COMPLETED',
          paidAt: new Date(),
        },
      });

      this.events.emit('payment.completed', { payment: updated, booking });
      this.logger.log(`Payment completed via webhook: ${id}`);
    } else if (status === 'failed') {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', gatewayId: id },
      });
      this.logger.warn(`Payment failed via webhook: ${id}`);
    }

    return { success: true };
  }

  async refundPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUniqueOrThrow({
      where: { id: paymentId },
    });

    if (payment.status !== 'COMPLETED') {
      throw new BadRequestException('لا يمكن استرداد دفعة غير مكتملة');
    }

    if (this.apiKey && this.isProduction && payment.gatewayId && !payment.gatewayId.startsWith('sim_')) {
      try {
        await axios.post(
          `${MOYASAR_API}/payments/${payment.gatewayId}/refund`,
          {},
          { auth: { username: this.apiKey, password: '' } },
        );
      } catch (error: any) {
        this.logger.error(`Moyasar refund failed: ${error.message}`);
        throw new BadRequestException('فشل في عملية الاسترداد');
      }
    }

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' },
    });

    this.events.emit('payment.refunded', { payment: updated });
    return { success: true, data: updated };
  }

  async getByBooking(bookingId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: payments };
  }
}
