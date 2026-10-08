import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvoicesService } from '../invoices/invoices.service';
import { NotificationsService } from '../notifications/notifications.service';
// import { prisma } from '@homia-os/database';
const prisma = { property: { findMany: async () => [] }, lease: { findMany: async () => [] }, invoice: { findMany: async () => [] } } as any;

@Injectable()
export class BillingScheduler {
  private readonly logger = new Logger(BillingScheduler.name);

  constructor(
    private invoicesService: InvoicesService,
    private notificationsService: NotificationsService
  ) {}

  @Cron('0 8 1 * *') // Run on 1st of each month at 8 AM
  async handleMonthlyBilling() {
    this.logger.debug('Running monthly billing job');
    const properties = await prisma.property.findMany();
    
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    for (const property of properties) {
      try {
        await this.invoicesService.generateMonthlyInvoices(
          { month, year, propertyId: property.id },
          property.ownerId
        );
      } catch (e) {
        this.logger.error(`Failed billing for property ${property.id}: ${e}`);
      }
    }
  }

  @Cron('0 9 * * *') // Daily at 9 AM
  async handleLeaseExpiryCheck() {
    this.logger.debug('Running daily lease expiry check');
    // Find leases expiring in 30, 14, 7, 1 days
    // Logic goes here...
  }

  @Cron('0 10 * * 1') // Weekly on Monday at 10 AM
  async handleOverduePaymentReminders() {
    this.logger.debug('Running weekly overdue payment reminders');
    // Find overdue invoices and notify...
  }
}
