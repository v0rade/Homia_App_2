import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { BillingProcessor } from './billing.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'billing',
    }),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, BillingProcessor],
  exports: [InvoicesService],
})
export class InvoicesModule {}
