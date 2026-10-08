import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InvoicesService } from './invoices.service';

@Processor('billing')
export class BillingProcessor {
  private readonly logger = new Logger(BillingProcessor.name);

  constructor(private readonly invoicesService: InvoicesService) {}

  @Process('generate-monthly')
  async handleGenerateMonthly(job: Job) {
    this.logger.debug('Start processing billing job...');
    const { dto, ownerId } = job.data;
    await this.invoicesService.generateMonthlyInvoices(dto, ownerId);
    this.logger.debug('Finished processing billing job.');
  }
}
