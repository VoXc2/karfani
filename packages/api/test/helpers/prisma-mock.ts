import { vi } from 'vitest';

export function createMockPrismaService() {
  return {
    booking: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    caravan: {
      findUnique: vi.fn(),
      findUniqueOrThrow: vi.fn(),
    },
    payment: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    availabilitySlot: {
      findMany: vi.fn(),
      count: vi.fn(),
      upsert: vi.fn(),
    },
    pricingRule: {
      create: vi.fn(),
    },
  };
}

export type MockPrismaService = ReturnType<typeof createMockPrismaService>;
