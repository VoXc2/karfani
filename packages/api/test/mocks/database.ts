// Mock @karfani/database to avoid requiring @prisma/client during tests
export class PrismaClient {
  $connect() { return Promise.resolve(); }
  $disconnect() { return Promise.resolve(); }
}
