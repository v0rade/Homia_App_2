import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ManualGateway } from './gateways/manual.gateway';
// import { prisma } from '@homia-os/database';
const prisma = { payment: { create: async () => ({}), findMany: async () => [], findUnique: async () => null, update: async () => ({}) }, invoice: { findUnique: async () => null, update: async () => ({}) } } as any;

@Injectable()
export class PaymentsService {
  constructor(private readonly manualGateway: ManualGateway) {}

  async createPayment(ownerId: string, createPaymentDto: CreatePaymentDto) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: createPaymentDto.invoiceId },
      include: { lease: { include: { room: { include: { property: true } } } } }
    });

    if (!invoice || invoice.lease.room.property.ownerId !== ownerId) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === 'PAID') {
      throw new BadRequestException('Invoice is already paid');
    }

    // Payments are immutable, we create a new record
    const payment = await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: createPaymentDto.amount,
        method: createPaymentDto.method,
        reference: createPaymentDto.reference,
        status: 'PENDING',
      }
    });

    return payment;
  }

  async verifyPayment(id: string, verifierId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { invoice: true }
    });
    
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'PENDING') throw new BadRequestException(`Payment is already ${payment.status}`);

    const isVerified = await this.manualGateway.verifyPayment(payment.id);
    if (!isVerified) throw new BadRequestException('Payment verification failed at gateway');

    // Update payment (in a real immutable ledger, we might append a verification record instead, but updating status is common)
    const verifiedPayment = await prisma.payment.update({
      where: { id },
      data: { status: 'VERIFIED', verifiedById: verifierId, verifiedAt: new Date() }
    });

    // Update invoice status
    await prisma.invoice.update({
      where: { id: payment.invoiceId },
      data: { status: 'PAID' }
    });

    return verifiedPayment;
  }

  async rejectPayment(id: string, reason: string, rejectorId: string) {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'PENDING') throw new BadRequestException(`Payment is already ${payment.status}`);

    return prisma.payment.update({
      where: { id },
      data: { status: 'REJECTED', notes: reason }
    });
  }

  async getPaymentHistory(tenantId: string) {
    return prisma.payment.findMany({
      where: { invoice: { tenantId } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAll(ownerId: string) {
    return prisma.payment.findMany({
      where: { invoice: { lease: { room: { property: { ownerId } } } } },
      orderBy: { createdAt: 'desc' },
      include: { invoice: { include: { tenant: true } } }
    });
  }
}
