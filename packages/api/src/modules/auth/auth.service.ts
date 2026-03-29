import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';
import { formatSaudiPhone, validateSaudiPhone } from '@karfani/shared';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private otpStore = new Map<string, { otp: string; expiresAt: Date; attempts: number }>();

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private events: EventEmitter2,
  ) {}

  async sendOtp(phone: string) {
    const formatted = formatSaudiPhone(phone);
    if (!validateSaudiPhone(formatted)) {
      throw new BadRequestException('رقم الجوال غير صحيح');
    }

    const otp = this.generateOtp();
    const expiryMinutes = this.config.get<number>('OTP_EXPIRY_MINUTES') || 5;

    this.otpStore.set(formatted, {
      otp,
      expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
      attempts: 0,
    });

    // TODO: Send via Unifonic SMS in production
    console.log(`[OTP] ${formatted}: ${otp}`);

    this.events.emit('auth.otpSent', { phone: formatted });

    return {
      success: true,
      message: 'تم إرسال رمز التحقق',
      // Include OTP in dev mode for testing
      ...(this.config.get('NODE_ENV') !== 'production' && { otp }),
    };
  }

  async verifyOtp(phone: string, otp: string) {
    const formatted = formatSaudiPhone(phone);
    const stored = this.otpStore.get(formatted);

    if (!stored) {
      throw new BadRequestException('لم يتم إرسال رمز تحقق لهذا الرقم');
    }

    if (stored.attempts >= 5) {
      this.otpStore.delete(formatted);
      throw new BadRequestException('تم تجاوز عدد المحاولات المسموحة');
    }

    if (new Date() > stored.expiresAt) {
      this.otpStore.delete(formatted);
      throw new BadRequestException('انتهت صلاحية رمز التحقق');
    }

    if (stored.otp !== otp) {
      stored.attempts++;
      throw new BadRequestException('رمز التحقق غير صحيح');
    }

    this.otpStore.delete(formatted);

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { phone: formatted } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: formatted,
          fullNameAr: 'مستخدم جديد',
          isVerified: true,
        },
      });
      this.events.emit('auth.userCreated', user);
    }

    const tokens = this.generateTokens(user);

    this.events.emit('auth.loginSuccess', { userId: user.id });

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          fullNameAr: user.fullNameAr,
          fullNameEn: user.fullNameEn,
          email: user.email,
          roles: user.roles,
          avatarUrl: user.avatarUrl,
          isVerified: user.isVerified,
        },
        ...tokens,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        this.config.get('JWT_REFRESH_SECRET')!,
      ) as any;

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('الحساب غير فعال');
      }

      const tokens = this.generateTokens(user);
      return { success: true, data: tokens };
    } catch {
      throw new UnauthorizedException('رمز التحديث غير صالح');
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        email: true,
        fullNameAr: true,
        fullNameEn: true,
        nationalId: true,
        roles: true,
        locale: true,
        avatarUrl: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        drivingLicense: true,
        ownerProfile: true,
      },
    });

    if (!user) throw new UnauthorizedException('المستخدم غير موجود');

    return { success: true, data: user };
  }

  async updateProfile(userId: string, data: { fullNameAr?: string; fullNameEn?: string; email?: string; locale?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        phone: true,
        email: true,
        fullNameAr: true,
        fullNameEn: true,
        roles: true,
        locale: true,
        avatarUrl: true,
        isVerified: true,
      },
    });

    return { success: true, data: user };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateTokens(user: { id: string; roles: string[] }) {
    const payload = { sub: user.id, roles: user.roles };

    const accessToken = jwt.sign(payload, this.config.get('JWT_SECRET')!, {
      expiresIn: '7d',
    });

    const refreshToken = jwt.sign(payload, this.config.get('JWT_REFRESH_SECRET')!, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }
}
