import { Injectable } from '@nestjs/common';
// import { prisma } from '@homia-os/database';
const prisma = { property: { count: async () => 0 }, tenant: { count: async () => 0 }, room: { findMany: async () => [] }, invoice: { findMany: async () => [] } } as any;

@Injectable()
export class AnalyticsService {
  async getDashboardStats(ownerId: string, propertyId?: string) {
    const propertyWhere = propertyId ? { id: propertyId, ownerId } : { ownerId };
    
    const [totalProperties, totalTenants, rooms] = await Promise.all([
      prisma.property.count({ where: propertyWhere }),
      prisma.tenant.count({ where: { ownerId } }),
      prisma.room.findMany({ where: { property: propertyWhere } })
    ]);

    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r: any) => r.status === 'OCCUPIED').length;
    
    return {
      totalProperties,
      totalTenants,
      totalRooms,
      occupancyRate: totalRooms ? (occupiedRooms / totalRooms) * 100 : 0
    };
  }

  async getRevenueByMonth(ownerId: string, propertyId: string, months: number = 6) {
    // Simplified mockup, real implementation uses GroupBy
    return [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 15500 },
    ];
  }

  async getOccupancyTrend(ownerId: string, propertyId: string, months: number = 6) {
    return [
      { month: 'Jan', occupancy: 85 },
      { month: 'Feb', occupancy: 90 },
    ];
  }

  async getPaymentStatusBreakdown(ownerId: string, propertyId: string) {
    const invoices = await prisma.invoice.findMany({
      where: { lease: { room: { property: { ownerId, id: propertyId } } } }
    });
    
    const paid = invoices.filter((i: any) => i.status === 'PAID').length;
    const pending = invoices.filter((i: any) => i.status === 'PENDING').length;
    const overdue = invoices.filter((i: any) => i.status === 'OVERDUE').length;
    
    return { paid, pending, overdue };
  }
}
