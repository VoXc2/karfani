import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import * as jwt from 'jsonwebtoken';

describe('AuthGuard', () => {
  const JWT_SECRET = 'test-secret-key';
  let guard: AuthGuard;
  let mockConfigService: any;

  beforeEach(() => {
    mockConfigService = { get: vi.fn().mockReturnValue(JWT_SECRET) };
    guard = new AuthGuard(mockConfigService);
  });

  function createMockContext(authHeader?: string) {
    const request: any = { headers: { authorization: authHeader }, user: undefined };
    return {
      switchToHttp: () => ({ getRequest: () => request }),
      request,
    } as any;
  }

  it('allows access with valid Bearer token and attaches user to request', () => {
    const payload = { sub: 'user-123', roles: ['CUSTOMER'] };
    const token = jwt.sign(payload, JWT_SECRET);
    const context = createMockContext(`Bearer ${token}`);

    const result = guard.canActivate(context);
    expect(result).toBe(true);

    const request = context.switchToHttp().getRequest();
    expect(request.user).toBeDefined();
    expect(request.user.sub).toBe('user-123');
  });

  it('throws UnauthorizedException when Authorization header is missing', () => {
    const context = createMockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when token does not start with Bearer', () => {
    const context = createMockContext('Basic abc123');
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException for expired/malformed JWT', () => {
    const context = createMockContext('Bearer invalid.token.here');
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException for token signed with wrong secret', () => {
    const token = jwt.sign({ sub: 'user-123' }, 'wrong-secret');
    const context = createMockContext(`Bearer ${token}`);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
