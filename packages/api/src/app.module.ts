import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { BookingModule } from './modules/booking/booking.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { InspectionModule } from './modules/inspection/inspection.module';
import { DamageModule } from './modules/damage/damage.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { SupportModule } from './modules/support/support.module';
import { ContentModule } from './modules/content/content.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadModule } from './modules/upload/upload.module';
import { HealthModule } from './modules/health/health.module';
import { EventsModule } from './gateways/events.module';
import { QueueModule } from './queues/queue.module';
import { CacheModule } from './common/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    EventsModule,
    QueueModule,
    CacheModule,
    AuthModule,
    InventoryModule,
    AvailabilityModule,
    PricingModule,
    BookingModule,
    PaymentsModule,
    ContractsModule,
    InspectionModule,
    DamageModule,
    MaintenanceModule,
    DispatchModule,
    SupportModule,
    ContentModule,
    AnalyticsModule,
    AdminModule,
    NotificationsModule,
    UploadModule,
    HealthModule,
  ],
})
export class AppModule {}
