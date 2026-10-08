import { Injectable, NotFoundException } from '@nestjs/common';
import { formatCurrency } from '../../common/utils/format.util';
// import { prisma } from '@homia-os/database';
const prisma = { invoice: { findUnique: async () => null } } as any;

@Injectable()
export class WhatsappService {
  async generateReminderMessage(invoiceId: string, ownerId: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { tenant: true, lease: { include: { room: true } } }
    });

    if (!invoice || invoice.lease.room.property.ownerId !== ownerId) {
      throw new NotFoundException('Invoice not found');
    }

    const { tenant, lease, amount, invoiceNumber } = invoice;
    const formattedAmount = formatCurrency(amount);

    const message = `Halo ${tenant.firstName},\n\nTagihan kos untuk Room ${lease.room.number} telah tersedia.\n\nNomor Tagihan: ${invoiceNumber}\nTotal Tagihan: ${formattedAmount}\nJatuh Tempo: ${new Date(invoice.dueDate).toLocaleDateString('id-ID')}\n\nSilakan lakukan pembayaran sebelum tanggal jatuh tempo. Terima kasih.`;

    const link = this.generateWhatsAppLink(tenant.phone, message);

    return { message, link };
  }

  generateWhatsAppLink(phone: string, message: string) {
    // Format phone to international format (remove leading 0 and add 62)
    let formattedPhone = phone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    }
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  }
}
