import { Injectable, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private events: EventEmitter2) {}

  async initiatePayment(bookingId: string, method: string) {
    const booking = await this.prisma.booking.findUniqueOrThrow({ where: { id: bookingId } });
    if (booking.status !== 'PENDING_PAYMENT') throw new BadRequestException('الحجز ليس بانتظار الدفع');

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

    // TODO: Integrate Moyasar API for real payment processing
    // For now, simulate success
    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED', paidAt: new Date(), gatewayId: `sim_${Date.now()}` },
    });

    await this.prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } });

    // Create security deposit record
    await this.prisma.payment.create({
      data: {
        bookingId,
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

  async handleWebhook(body: any) {
    // TODO: Verify Moyasar signature and process webhook
    return { success: true };
  }

  async getByBooking(bookingId: string) {
    const payments = await this.prisma.payment.findMany({ where: { bookingId }, orderBy: { createdAt: 'desc' } });
    return { success: true, data: payments };
  }
}
