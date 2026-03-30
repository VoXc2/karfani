import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as Handlebars from 'handlebars';

const CONTRACT_TEMPLATE = `
{
  "title": "عقد تأجير كرفان",
  "bookingNumber": "{{bookingNumber}}",
  "customerName": "{{customerName}}",
  "customerPhone": "{{customerPhone}}",
  "caravanTitle": "{{caravanTitle}}",
  "caravanPlate": "{{caravanPlate}}",
  "startDate": "{{startDate}}",
  "endDate": "{{endDate}}",
  "totalDays": {{totalDays}},
  "totalPrice": {{totalPrice}},
  "securityDeposit": {{securityDeposit}},
  "terms": [
    "يلتزم المستأجر بالمحافظة على الكرفان",
    "يتحمل المستأجر أي أضرار ناتجة عن سوء الاستخدام",
    "يتم خصم قيمة الأضرار من مبلغ التأمين",
    "يلتزم المستأجر بإعادة الكرفان في الموعد المحدد"
  ]
}
`;

const TEMPLATE_VERSION = '1.0.0';

@Injectable()
export class ContractsService {
  private compiledTemplate: Handlebars.TemplateDelegate;

  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {
    this.compiledTemplate = Handlebars.compile(CONTRACT_TEMPLATE);
  }

  async generate(userId: string, data: { bookingId: string }) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: {
        customer: { select: { fullNameAr: true, phone: true } },
        caravan: { select: { titleAr: true, plateNumber: true } },
      },
    });
    if (!booking) throw new NotFoundException('الحجز غير موجود');

    const existingContract = await this.prisma.contract.findUnique({ where: { bookingId: data.bookingId } });
    if (existingContract) throw new BadRequestException('يوجد عقد بالفعل لهذا الحجز');

    const contentString = this.compiledTemplate({
      bookingNumber: booking.bookingNumber,
      customerName: booking.customer.fullNameAr,
      customerPhone: booking.customer.phone,
      caravanTitle: booking.caravan.titleAr,
      caravanPlate: booking.caravan.plateNumber,
      startDate: booking.startDate.toISOString().split('T')[0],
      endDate: booking.endDate.toISOString().split('T')[0],
      totalDays: booking.totalDays,
      totalPrice: Number(booking.totalPrice),
      securityDeposit: Number(booking.securityDeposit),
    });

    const contentJson = JSON.parse(contentString);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const contract = await this.prisma.contract.create({
      data: {
        bookingId: data.bookingId,
        templateVersion: TEMPLATE_VERSION,
        contentJson,
        status: 'DRAFT',
        expiresAt,
      },
    });

    this.events.emit('contract.generated', contract);

    return { success: true, data: contract };
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        booking: {
          select: {
            bookingNumber: true,
            status: true,
            customer: { select: { fullNameAr: true, phone: true } },
            caravan: { select: { titleAr: true, plateNumber: true } },
          },
        },
      },
    });
    if (!contract) throw new NotFoundException('العقد غير موجود');
    return { success: true, data: contract };
  }

  async sign(id: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: { booking: { select: { customerId: true } } },
    });
    if (!contract) throw new NotFoundException('العقد غير موجود');

    if (contract.expiresAt && contract.expiresAt < new Date()) {
      await this.prisma.contract.update({ where: { id }, data: { status: 'EXPIRED' } });
      throw new BadRequestException('انتهت صلاحية العقد');
    }

    if (!['DRAFT', 'SENT'].includes(contract.status)) {
      throw new BadRequestException('لا يمكن توقيع العقد في حالته الحالية');
    }

    const isCustomer = contract.booking.customerId === userId;

    const updateData: any = {};
    if (isCustomer) {
      updateData.customerSignedAt = new Date();
      updateData.status = contract.operatorSignedAt ? 'FULLY_SIGNED' : 'CUSTOMER_SIGNED';
    } else {
      updateData.operatorSignedAt = new Date();
      updateData.status = contract.customerSignedAt ? 'FULLY_SIGNED' : 'SENT';
    }

    const updated = await this.prisma.contract.update({ where: { id }, data: updateData });

    this.events.emit('contract.signed', { contract: updated, signedBy: userId });

    return { success: true, data: updated };
  }

  async findByBooking(bookingId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { bookingId },
      include: {
        booking: {
          select: {
            bookingNumber: true,
            status: true,
            customer: { select: { fullNameAr: true } },
            caravan: { select: { titleAr: true } },
          },
        },
      },
    });
    if (!contract) throw new NotFoundException('لا يوجد عقد لهذا الحجز');
    return { success: true, data: contract };
  }
}
