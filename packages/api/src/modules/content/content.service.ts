import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class ContentService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async getLocations(query: { type?: string; region?: string }) {
    const cacheKey = `content:locations:${JSON.stringify(query)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const where: any = { isActive: true };
    if (query.type) where.type = query.type;
    if (query.region) where.region = query.region;

    const locations = await this.prisma.location.findMany({
      where,
      orderBy: { nameAr: 'asc' },
    });

    const result = { success: true, data: locations };
    await this.cache.set(cacheKey, result, 600);
    return result;
  }

  async getRoutes(query: { difficulty?: string }) {
    const where: any = { isActive: true };
    if (query.difficulty) where.difficulty = query.difficulty;

    const routes = await this.prisma.route.findMany({
      where,
      include: {
        media: { take: 1, orderBy: { sortOrder: 'asc' } },
        campsites: {
          include: { campsite: { include: { location: true } } },
          orderBy: { dayNumber: 'asc' },
        },
      },
      orderBy: { rating: 'desc' },
    });

    return { success: true, data: routes };
  }

  async getCampsites(query: { region?: string }) {
    const where: any = { isActive: true };
    if (query.region) {
      where.location = { region: query.region };
    }

    const campsites = await this.prisma.campsite.findMany({
      where,
      include: { location: true },
      orderBy: { nameAr: 'asc' },
    });

    return { success: true, data: campsites };
  }

  async getMapData(query: { region?: string; type?: string }) {
    const cacheKey = `content:map:${JSON.stringify(query)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const [locations, caravans, routes, campsites] = await Promise.all([
      this.prisma.location.findMany({
        where: {
          isActive: true,
          ...(query.region ? { region: query.region } : {}),
          ...(query.type ? { type: query.type as any } : {}),
        },
      }),
      this.prisma.caravan.findMany({
        where: {
          status: 'ACTIVE',
          latitude: { not: null },
          longitude: { not: null },
          ...(query.region ? { pickupLocation: { region: query.region } } : {}),
        },
        select: {
          id: true,
          titleAr: true,
          titleEn: true,
          type: true,
          dailyRate: true,
          rating: true,
          sleeps: true,
          latitude: true,
          longitude: true,
          media: { take: 1, select: { url: true, thumbnailUrl: true } },
        },
      }),
      this.prisma.route.findMany({
        where: { isActive: true },
        select: {
          id: true,
          titleAr: true,
          titleEn: true,
          difficulty: true,
          distanceKm: true,
          durationDays: true,
          waypoints: true,
          rating: true,
          coverImageUrl: true,
        },
      }),
      this.prisma.campsite.findMany({
        where: { isActive: true },
        include: { location: true },
      }),
    ]);

    const result = {
      success: true,
      data: { locations, caravans, routes, campsites },
    };
    await this.cache.set(cacheKey, result, 600);
    return result;
  }
}
