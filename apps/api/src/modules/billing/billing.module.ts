import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BillingScheduler } from './billing.scheduler';
import { InvoicesModule } from '../invoices/invoices.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ScheduleModule.forRoot(), InvoicesModule, NotificationsModule],
  providers: [BillingScheduler],
})
export class BillingModule {}
