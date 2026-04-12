import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockEventEmitter, type MockEventEmitter } from '../../../../test/helpers/event-emitter-mock';

vi.mock('@karfani/shared', () => ({
  formatSaudiPhone: vi.fn((phone: string) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('+966')) return cleaned;
    if (cleaned.startsWith('966')) return `+${cleaned}`;
    if (cleaned.startsWith('05')) return `+966${cleaned.slice(1)}`;
    if (cleaned.startsWith('5')) return `+966${cleaned}`;
    return cleaned;
  }),
  validateSaudiPhone: vi.fn((phone: string) => /^\+966[0-9]{9}$/.test(phone)),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: MockPrismaService;
  let events: MockEventEmitter;
  let mockConfig: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    prisma = createMockPrismaService();
    events = createMockEventEmitter();
    mockConfig = {
      get: vi.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
        if (key === 'NODE_ENV') return 'test';
        return null;
      }),
    };
    service = new AuthService(prisma as any, mockConfig as any, events as any);
  });

  describe('sendOtp', () => {
    it('sends OTP for a valid Saudi phone number', async () => {
      const result = await service.sendOtp('0512345678');
      expect(result.success).toBe(true);
      expect(result.message).toBe('\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642');
    });

    it('returns OTP in non-production mode', async () => {
      const result = await service.sendOtp('0512345678');
      expect(result.otp).toBeDefined();
      expect(result.otp).toHaveLength(6);
    });

    it('does not return OTP in production mode', async () => {
      mockConfig.get = vi.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
        if (key === 'NODE_ENV') return 'production';
        return null;
      });

      const result = await service.sendOtp('0512345678');
      expect(result.otp).toBeUndefined();
    });

    it('throws BadRequestException for invalid phone number', async () => {
      await expect(service.sendOtp('123')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for empty phone string', async () => {
      await expect(service.sendOtp('')).rejects.toThrow(BadRequestException);
    });

    it('emits auth.otpSent event with formatted phone', async () => {
      await service.sendOtp('0512345678');
      expect(events.emit).toHaveBeenCalledWith('auth.otpSent', {
        phone: '+966512345678',
      });
    });

    it('generates a 6-digit numeric OTP', async () => {
      const result = await service.sendOtp('0512345678');
      expect(result.otp).toMatch(/^\d{6}$/);
    });

    it('accepts phone numbers starting with +966', async () => {
      const result = await service.sendOtp('+966512345678');
      expect(result.success).toBe(true);
    });

    it('accepts phone numbers starting with 966', async () => {
      const result = await service.sendOtp('966512345678');
      expect(result.success).toBe(true);
    });
  });

  describe('verifyOtp', () => {
    const phone = '0512345678';
    const formattedPhone = '+966512345678';

    const mockUser = {
      id: 'user-1',
      phone: formattedPhone,
      fullNameAr: '\u0645\u062D\u0645\u062F',
      fullNameEn: 'Mohammed',
      email: 'test@test.com',
      roles: ['USER'],
      avatarUrl: null,
      isVerified: true,
      isActive: true,
    };

    it('verifies OTP and returns tokens for existing user', async () => {
      const sendResult = await service.sendOtp(phone);
      const otp = sendResult.otp!;

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.verifyOtp(phone, otp);
      expect(result.success).toBe(true);
      expect(result.data.accessToken).toBeDefined();
      expect(result.data.refreshToken).toBeDefined();
      expect(result.data.user.id).toBe('user-1');
    });

    it('creates a new user when phone is not registered', async () => {
      const sendResult = await service.sendOtp(phone);
      const otp = sendResult.otp!;

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        ...mockUser,
        id: 'new-user-1',
        fullNameAr: '\u0645\u0633\u062A\u062E\u062F\u0645 \u062C\u062F\u064A\u062F',
      });

      const result = await service.verifyOtp(phone, otp);
      expect(result.success).toBe(true);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          phone: formattedPhone,
          fullNameAr: '\u0645\u0633\u062A\u062E\u062F\u0645 \u062C\u062F\u064A\u062F',
          isVerified: true,
        },
      });
    });

    it('emits auth.userCreated event when new user is created', async () => {
      const sendResult = await service.sendOtp(phone);
      const otp = sendResult.otp!;

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        ...mockUser,
        id: 'new-user-1',
      });

      await service.verifyOtp(phone, otp);
      expect(events.emit).toHaveBeenCalledWith('auth.userCreated', expect.objectContaining({ id: 'new-user-1' }));
    });

    it('emits auth.loginSuccess event after successful verification', async () => {
      const sendResult = await service.sendOtp(phone);
      const otp = sendResult.otp!;

      prisma.user.findUnique.mockResolvedValue(mockUser);

      await service.verifyOtp(phone, otp);
      expect(events.emit).toHaveBeenCalledWith('auth.loginSuccess', { userId: 'user-1' });
    });

    it('throws BadRequestException for wrong OTP', async () => {
      await service.sendOtp(phone);
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.verifyOtp(phone, '000000')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when no OTP was sent for the phone', async () => {
      await expect(service.verifyOtp(phone, '123456')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when OTP has expired', async () => {
      await service.sendOtp(phone);

      const otpStore = (service as any).otpStore as Map<string, { otp: string; expiresAt: Date; attempts: number }>;
      const stored = otpStore.get(formattedPhone)!;
      stored.expiresAt = new Date(Date.now() - 1000);

      await expect(service.verifyOtp(phone, stored.otp)).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException after max attempts exceeded', async () => {
      await service.sendOtp(phone);

      const otpStore = (service as any).otpStore as Map<string, { otp: string; expiresAt: Date; attempts: number }>;
      const stored = otpStore.get(formattedPhone)!;
      stored.attempts = 5;

      await expect(service.verifyOtp(phone, stored.otp)).rejects.toThrow(BadRequestException);
    });

    it('increments attempts on wrong OTP', async () => {
      await service.sendOtp(phone);

      await expect(service.verifyOtp(phone, '000000')).rejects.toThrow(BadRequestException);

      const otpStore = (service as any).otpStore as Map<string, { otp: string; expiresAt: Date; attempts: number }>;
      const stored = otpStore.get(formattedPhone)!;
      expect(stored.attempts).toBe(1);
    });

    it('deletes OTP from store after successful verification', async () => {
      const sendResult = await service.sendOtp(phone);
      const otp = sendResult.otp!;

      prisma.user.findUnique.mockResolvedValue(mockUser);

      await service.verifyOtp(phone, otp);

      const otpStore = (service as any).otpStore as Map<string, any>;
      expect(otpStore.has(formattedPhone)).toBe(false);
    });

    it('returns user data in the response', async () => {
      const sendResult = await service.sendOtp(phone);
      const otp = sendResult.otp!;

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.verifyOtp(phone, otp);
      expect(result.data.user.phone).toBe(formattedPhone);
      expect(result.data.user.fullNameAr).toBe('\u0645\u062D\u0645\u062F');
      expect(result.data.user.roles).toEqual(['USER']);
    });
  });

  describe('refreshToken', () => {
    const mockUser = {
      id: 'user-1',
      phone: '+966512345678',
      roles: ['USER'],
      isActive: true,
    };

    it('returns new tokens for a valid refresh token', async () => {
      const sendResult = await service.sendOtp('0512345678');
      const otp = sendResult.otp!;
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const verifyResult = await service.verifyOtp('0512345678', otp);
      const validRefreshToken = verifyResult.data.refreshToken;

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.refreshToken(validRefreshToken);
      expect(result.success).toBe(true);
      expect(result.data.accessToken).toBeDefined();
      expect(result.data.refreshToken).toBeDefined();
    });

    it('throws UnauthorizedException for an invalid refresh token', async () => {
      await expect(service.refreshToken('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when user is inactive', async () => {
      const sendResult = await service.sendOtp('0512345678');
      const otp = sendResult.otp!;
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const verifyResult = await service.verifyOtp('0512345678', otp);
      const validRefreshToken = verifyResult.data.refreshToken;

      prisma.user.findUnique.mockResolvedValue({ ...mockUser, isActive: false });

      await expect(service.refreshToken(validRefreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when user is not found', async () => {
      const sendResult = await service.sendOtp('0512345678');
      const otp = sendResult.otp!;
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const verifyResult = await service.verifyOtp('0512345678', otp);
      const validRefreshToken = verifyResult.data.refreshToken;

      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken(validRefreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for a malformed JWT', async () => {
      await expect(service.refreshToken('eyJhbGciOiJIUzI1NiJ9.broken.token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    it('returns user profile when user exists', async () => {
      const mockUser = {
        id: 'user-1',
        phone: '+966512345678',
        email: 'test@test.com',
        fullNameAr: '\u0645\u062D\u0645\u062F',
        fullNameEn: 'Mohammed',
        nationalId: null,
        roles: ['USER'],
        locale: 'ar',
        avatarUrl: null,
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        drivingLicense: null,
        ownerProfile: null,
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getMe('user-1');
      expect(result.success).toBe(true);
      expect(result.data.id).toBe('user-1');
      expect(result.data.phone).toBe('+966512345678');
    });

    it('throws UnauthorizedException when user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getMe('nonexistent')).rejects.toThrow(UnauthorizedException);
    });

    it('calls prisma with correct select fields', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });

      await service.getMe('user-1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: expect.objectContaining({
          id: true,
          phone: true,
          email: true,
          fullNameAr: true,
          fullNameEn: true,
          roles: true,
          drivingLicense: true,
          ownerProfile: true,
        }),
      });
    });
  });

  describe('updateProfile', () => {
    it('updates user profile successfully', async () => {
      const updatedUser = {
        id: 'user-1',
        phone: '+966512345678',
        email: 'updated@test.com',
        fullNameAr: '\u0623\u062D\u0645\u062F',
        fullNameEn: 'Ahmed',
        roles: ['USER'],
        locale: 'ar',
        avatarUrl: null,
        isVerified: true,
      };
      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('user-1', {
        fullNameAr: '\u0623\u062D\u0645\u062F',
        fullNameEn: 'Ahmed',
        email: 'updated@test.com',
      });

      expect(result.success).toBe(true);
      expect(result.data.fullNameAr).toBe('\u0623\u062D\u0645\u062F');
      expect(result.data.email).toBe('updated@test.com');
    });

    it('calls prisma.user.update with correct arguments', async () => {
      prisma.user.update.mockResolvedValue({ id: 'user-1' });

      await service.updateProfile('user-1', { locale: 'en' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { locale: 'en' },
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
    });

    it('passes only the provided fields to prisma update', async () => {
      prisma.user.update.mockResolvedValue({ id: 'user-1' });

      await service.updateProfile('user-1', { fullNameEn: 'Ali' });

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { fullNameEn: 'Ali' },
        }),
      );
    });
  });
});
