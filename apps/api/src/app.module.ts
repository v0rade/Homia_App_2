import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import configuration from './config/configuration';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { LeasesModule } from './modules/leases/leases.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AccessCodesModule } from './modules/access-codes/access-codes.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { SearchModule } from './modules/search/search.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [
    // Global config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // BullMQ for background jobs
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379'),
          password: process.env.REDIS_PASSWORD || undefined,
        },
      }),
    }),

    // Feature modules
    AuthModule,
    PropertiesModule,
    RoomsModule,
    TenantsModule,
    LeasesModule,
    InvoicesModule,
    PaymentsModule,
    MaintenanceModule,
    NotificationsModule,
    AnnouncementsModule,
    AccessCodesModule,
    AnalyticsModule,
    WhatsappModule,
    SearchModule,
    AuditLogModule,
    BillingModule,
  ],
})
export class AppModule {}
