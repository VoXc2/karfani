import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger('CacheService');
  private redis: Redis | null = null;

  constructor(private readonly configService: ConfigService) {
    try {
      const redisUrl = this.configService.get('REDIS_URL', 'redis://localhost:6379');
      this.redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => Math.min(times * 100, 3000),
        lazyConnect: true,
      });
      this.redis.connect().catch((err) => {
        this.logger.warn(`Redis connection failed, caching disabled: ${err.message}`);
        this.redis = null;
      });
    } catch {
      this.logger.warn('Redis not available, caching disabled');
      this.redis = null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;
    try {
      const value = await this.redis.get(`karfani:${key}`);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    if (!this.redis) return;
    try {
      await this.redis.set(`karfani:${key}`, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      this.logger.warn(`Cache set failed for key: ${key}`);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    if (!this.redis) return;
    try {
      const keys = await this.redis.keys(`karfani:${pattern}`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch {
      this.logger.warn(`Cache invalidation failed for pattern: ${pattern}`);
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}
