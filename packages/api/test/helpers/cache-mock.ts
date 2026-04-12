import { vi } from 'vitest';

export function createMockCacheService() {
  return {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue(undefined),
    del: vi.fn().mockResolvedValue(undefined),
    invalidate: vi.fn().mockResolvedValue(undefined),
  };
}

export type MockCacheService = ReturnType<typeof createMockCacheService>;
