import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '../roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let mockReflector: any;

  beforeEach(() => {
    mockReflector = { getAllAndOverride: vi.fn() };
    guard = new RolesGuard(mockReflector);
  });

  function createMockContext(user?: any) {
    const request = { user };
    return {
      switchToHttp: () => ({ getRequest: () => request }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  }

  it('allows access when no roles are required on the route', () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);
    const context = createMockContext({ roles: ['CUSTOMER'] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access when user has required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['CUSTOMER']);
    const context = createMockContext({ roles: ['CUSTOMER'] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access when user has one of multiple required roles', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['OPS_ADMIN', 'SUPER_ADMIN']);
    const context = createMockContext({ roles: ['SUPER_ADMIN'] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('throws ForbiddenException when user lacks required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['OPS_ADMIN']);
    const context = createMockContext({ roles: ['CUSTOMER'] });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when user has no roles property', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['CUSTOMER']);
    const context = createMockContext({});
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when user is undefined', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['CUSTOMER']);
    const context = createMockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
