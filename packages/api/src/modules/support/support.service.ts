import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';
import { generateTicketNumber } from '@karfani/shared';

@Injectable()
export class SupportService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  async createTicket(userId: string, data: any) {
    const { subject, category, priority, bookingId, message } = data;

    const ticket = await this.prisma.supportTicket.create({
      data: {
        ticketNumber: generateTicketNumber(),
        userId,
        subject,
        category,
        priority: priority || 'MEDIUM',
        bookingId: bookingId || null,
        messages: message
          ? {
              create: {
                senderId: userId,
                senderRole: 'CUSTOMER',
                content: message,
              },
            }
          : undefined,
      },
      include: { messages: true },
    });

    this.events.emit('ticket.created', ticket);

    return { success: true, data: ticket };
  }

  async findByUser(userId: string, query: any) {
    const { status, page = 1, limit = 20 } = query;
    const where: any = { userId };
    if (status) where.status = status;

    const [tickets, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where,
        include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      this.prisma.supportTicket.count({ where }),
    ]);

    return {
      success: true,
      data: tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findOne(id: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        messages: { include: { sender: { select: { fullNameAr: true, fullNameEn: true } } }, orderBy: { createdAt: 'asc' } },
        booking: { select: { bookingNumber: true, status: true } },
        user: { select: { fullNameAr: true, phone: true } },
        assignedTo: { select: { fullNameAr: true } },
      },
    });
    if (!ticket) throw new NotFoundException('التذكرة غير موجودة');
    return { success: true, data: ticket };
  }

  async addMessage(ticketId: string, userId: string, data: any) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('التذكرة غير موجودة');

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { roles: true } });
    const senderRole = user?.roles?.includes('SUPPORT_AGENT') ? 'SUPPORT_AGENT' : 'CUSTOMER';

    const message = await this.prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId: userId,
        senderRole,
        content: data.content,
        attachmentUrl: data.attachmentUrl || null,
      },
      include: { sender: { select: { fullNameAr: true, fullNameEn: true } } },
    });

    // Move ticket to IN_PROGRESS if still OPEN and agent is replying
    if (ticket.status === 'OPEN' && senderRole === 'SUPPORT_AGENT') {
      await this.prisma.supportTicket.update({ where: { id: ticketId }, data: { status: 'IN_PROGRESS' } });
    }

    this.events.emit('ticket.messageAdded', { ticket, message });

    return { success: true, data: message };
  }
}
