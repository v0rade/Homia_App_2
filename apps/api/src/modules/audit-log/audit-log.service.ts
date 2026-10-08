import { Injectable } from '@nestjs/common';
// import { prisma } from '@homia-os/database';
const prisma = { auditLog: { create: async () => ({}), findMany: async () => [] } } as any;

@Injectable()
export class AuditLogService {
  async log(userId: string, action: string, entity: string, entityId: string, changes: any = {}) {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        changes
      }
    });
  }

  async findAll(filters: any) {
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.entity) where.entity = filters.entity;

    return prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }
}
