import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ImageProcessor } from './image.processor';
import { NotificationProcessor } from './notification.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'image-processing' },
      { name: 'notifications' },
    ),
  ],
  providers: [ImageProcessor, NotificationProcessor],
  exports: [BullModule],
})
export class QueueModule {}
