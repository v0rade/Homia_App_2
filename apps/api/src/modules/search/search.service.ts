import { Injectable } from '@nestjs/common';
// import { prisma } from '@homia-os/database';
const prisma = { tenant: { findMany: async () => [] }, room: { findMany: async () => [] }, invoice: { findMany: async () => [] } } as any;

@Injectable()
export class SearchService {
  async search(query: string, ownerId: string) {
    if (!query || query.length < 2) return { tenants: [], rooms: [], invoices: [] };

    const [tenants, rooms, invoices] = await Promise.all([
      prisma.tenant.findMany({
        where: {
          ownerId,
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ]
        },
        take: 5
      }),
      prisma.room.findMany({
        where: {
          property: { ownerId },
          number: { contains: query, mode: 'insensitive' }
        },
        take: 5
      }),
      prisma.invoice.findMany({
        where: {
          lease: { room: { property: { ownerId } } },
          invoiceNumber: { contains: query, mode: 'insensitive' }
        },
        take: 5
      })
    ]);

    return {
      tenants,
      rooms,
      invoices
    };
  }
}
