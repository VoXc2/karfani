import { vi } from 'vitest';

function createModelMock() {
  return {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    upsert: vi.fn(),
    aggregate: vi.fn(),
    groupBy: vi.fn(),
  };
}

export function createMockPrismaService() {
  return {
    booking: createModelMock(),
    caravan: createModelMock(),
    payment: createModelMock(),
    user: createModelMock(),
    ownerProfile: createModelMock(),
    review: createModelMock(),
    notification: createModelMock(),
    supportTicket: createModelMock(),
    ticketMessage: createModelMock(),
    contract: createModelMock(),
    inspection: createModelMock(),
    damageReport: createModelMock(),
    damagePhoto: createModelMock(),
    maintenanceJob: createModelMock(),
    dispatch: createModelMock(),
    content: createModelMock(),
    promoCode: createModelMock(),
    payout: createModelMock(),
    pricingRule: createModelMock(),
    availabilitySlot: createModelMock(),
    caravanMedia: createModelMock(),
    caravanDocument: createModelMock(),
    inspectionPhoto: createModelMock(),
    drivingLicense: createModelMock(),
    $queryRawUnsafe: vi.fn(),
    $transaction: vi.fn((fn: any) => fn({
      booking: createModelMock(),
      caravan: createModelMock(),
      maintenanceJob: createModelMock(),
    })),
  };
}

export type MockPrismaService = ReturnType<typeof createMockPrismaService>;
