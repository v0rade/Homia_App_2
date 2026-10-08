import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { NotificationsService } from '../notifications/notifications.service';
// import { prisma } from '@homia-os/database';
const prisma = { announcement: { create: async () => ({}), findMany: async () => [] }, tenant: { findMany: async () => [] } } as any;

@Injectable()
export class AnnouncementsService {
  constructor(private notificationsService: NotificationsService) {}

  async create(ownerId: string, dto: CreateAnnouncementDto) {
    const announcement = await prisma.announcement.create({
      data: {
        ...dto,
        ownerId
      }
    });

    // Targeting logic to send notifications
    let tenants = [];
    if (dto.targetType === 'ALL') {
      tenants = await prisma.tenant.findMany({ where: { ownerId } });
    } else if (dto.targetType === 'PROPERTY') {
      tenants = await prisma.tenant.findMany({ where: { leases: { some: { room: { propertyId: dto.targetId } } } } });
    } else if (dto.targetType === 'ROOM') {
      tenants = await prisma.tenant.findMany({ where: { leases: { some: { roomId: dto.targetId } } } });
    }
    
    // Create notifications for targeted tenants
    for (const t of tenants) {
      await this.notificationsService.createNotification(t.id, dto.title, dto.content, 'ANNOUNCEMENT');
    }

    return announcement;
  }

  async findAll(ownerId: string) {
    return prisma.announcement.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
