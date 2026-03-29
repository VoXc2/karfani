import { vi } from 'vitest';

export function createMockEventEmitter() {
  return {
    emit: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
  };
}

export type MockEventEmitter = ReturnType<typeof createMockEventEmitter>;
