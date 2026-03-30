import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  async listUsers(query: any) {
    const { page = 1, limit = 20, search } = query;
    const where: any = {};

    if (search) {
      where.OR = [
        { fullNameAr: { contains: search, mode: 'insensitive' } },
        { fullNameEn: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          fullNameAr: true,
          fullNameEn: true,
          email: true,
          phone: true,
          roles: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        drivingLicense: true,
        ownerProfile: true,
        _count: { select: { bookings: true, supportTickets: true, reviews: true } },
      },
    });
    if (!user) throw new NotFoundException('المستخدم غير موجود');
    return { success: true, data: user };
  }

  async updateUserStatus(id: string, data: { isActive: boolean }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('المستخدم غير موجود');

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive: data.isActive },
    });

    this.events.emit('admin.userStatusChanged', { userId: id, isActive: data.isActive });

    return { success: true, data: updated };
  }

  async getPendingCaravans(query: any) {
    const { page = 1, limit = 20 } = query;

    const [caravans, total] = await Promise.all([
      this.prisma.caravan.findMany({
        where: { status: 'PENDING_REVIEW' },
        include: {
          owner: { include: { user: { select: { fullNameAr: true, phone: true } } } },
          media: { take: 1 },
        },
        orderBy: { createdAt: 'asc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      this.prisma.caravan.count({ where: { status: 'PENDING_REVIEW' } }),
    ]);

    return {
      success: true,
      data: caravans,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async approveCaravan(id: string) {
    const caravan = await this.prisma.caravan.findUnique({ where: { id } });
    if (!caravan) throw new NotFoundException('الكرفان غير موجود');
    if (caravan.status !== 'PENDING_REVIEW') throw new BadRequestException('الكرفان ليس في حالة انتظار المراجعة');

    const updated = await this.prisma.caravan.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    this.events.emit('admin.caravanApproved', updated);

    return { success: true, data: updated };
  }

  async rejectCaravan(id: string, data: { reason?: string }) {
    const caravan = await this.prisma.caravan.findUnique({ where: { id } });
    if (!caravan) throw new NotFoundException('الكرفان غير موجود');
    if (caravan.status !== 'PENDING_REVIEW') throw new BadRequestException('الكرفان ليس في حالة انتظار المراجعة');

    const updated = await this.prisma.caravan.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });

    this.events.emit('admin.caravanRejected', { caravan: updated, reason: data.reason });

    return { success: true, data: updated };
  }

  async getDashboard() {
    const [totalUsers, totalCaravans, pendingCaravans, totalBookings, revenueResult] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.caravan.count(),
      this.prisma.caravan.count({ where: { status: 'PENDING_REVIEW' } }),
      this.prisma.booking.count(),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED', type: 'BOOKING_PAYMENT' },
        _sum: { amount: true },
      }),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalCaravans,
        pendingCaravans,
        totalBookings,
        totalRevenue: Number(revenueResult._sum.amount || 0),
      },
    };
  }
}
