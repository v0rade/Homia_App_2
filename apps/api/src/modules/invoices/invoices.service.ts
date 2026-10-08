import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { generateInvoiceNumber } from '../../common/utils/invoice-number.util';
// import { prisma } from '@homia-os/database';
const prisma = { 
  billingJob: { findUnique: async () => null, create: async () => ({}) },
  lease: { findMany: async () => [] },
  invoice: { create: async () => ({}), findMany: async () => [], findUnique: async () => null },
  utilityReading: { findFirst: async () => null }
} as any;

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  async generateMonthlyInvoices(dto: GenerateInvoiceDto, ownerId: string) {
    const { month, year, propertyId } = dto;
    const jobId = `billing_${ownerId}_${propertyId || 'all'}_${month}_${year}`;
    
    // 1. Idempotency check
    const existingJob = await prisma.billingJob.findUnique({ where: { id: jobId } });
    if (existingJob) {
      this.logger.warn(`Billing job ${jobId} already completed.`);
      return { message: 'Billing already generated for this period', jobId };
    }

    // 2. Fetch active leases
    const whereClause: any = { status: 'ACTIVE', room: { property: { ownerId } } };
    if (propertyId) {
      whereClause.room.property.id = propertyId;
    }
    
    const activeLeases = await prisma.lease.findMany({
      where: whereClause,
      include: { tenant: true, room: { include: { property: true } } },
    });

    let generatedCount = 0;

    for (const lease of activeLeases) {
      await this.generateInvoiceForLease(lease, month, year);
      generatedCount++;
    }

    // 8. Record in BillingJob
    await prisma.billingJob.create({
      data: {
        id: jobId,
        month,
        year,
        propertyId,
        ownerId,
        status: 'COMPLETED',
        invoicesGenerated: generatedCount,
      },
    });

    return { message: 'Invoices generated successfully', count: generatedCount };
  }

  async generateInvoiceForLease(lease: any, month: number, year: number) {
    // Look up utility readings
    const reading = await prisma.utilityReading.findFirst({
      where: { roomId: lease.roomId, month, year },
    });

    let electricityCost = 0;
    let waterCost = 0;
    if (reading) {
      electricityCost = reading.electricityUsage * 1500; // Mock rate
      waterCost = reading.waterUsage * 5000; // Mock rate
    }

    const totalAmount = lease.rentAmount + electricityCost + waterCost;
    const dueDate = new Date(year, month - 1, 5); // 5th of the month

    const invoiceNumber = generateInvoiceNumber('INV', new Date());

    return prisma.invoice.create({
      data: {
        invoiceNumber,
        leaseId: lease.id,
        tenantId: lease.tenantId,
        amount: totalAmount,
        status: 'PENDING',
        dueDate,
        month,
        year,
        items: {
          create: [
            { description: 'Rent', amount: lease.rentAmount },
            { description: 'Electricity', amount: electricityCost },
            { description: 'Water', amount: waterCost },
          ].filter(item => item.amount > 0)
        }
      }
    });
  }

  async calculateLateFee(invoice: any) {
    if (invoice.status === 'PAID') return 0;
    const now = new Date();
    if (now > new Date(invoice.dueDate)) {
      // 5% late fee
      return invoice.amount * 0.05;
    }
    return 0;
  }

  async listInvoices(ownerId: string, filters: any) {
    return prisma.invoice.findMany({
      where: { lease: { room: { property: { ownerId } } } },
      include: { tenant: true, items: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getInvoiceById(id: string, ownerId: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true, tenant: true, lease: { include: { room: true } } },
    });
    if (!invoice || invoice.lease.room.property.ownerId !== ownerId) {
      throw new NotFoundException(`Invoice ${id} not found`);
    }
    return invoice;
  }
}
