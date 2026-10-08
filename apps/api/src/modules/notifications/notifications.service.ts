import { Injectable, NotFoundException } from '@nestjs/common';
// import { prisma } from '@homia-os/database';
const prisma = { notification: { create: async () => ({}), findMany: async () => [], count: async () => 0, update: async () => ({}), updateMany: async () => ({}) } } as any;

@Injectable()
export class NotificationsService {
  async createNotification(userId: string, title: string, message: string, type: string) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        isRead: false
      }
    });
  }

  async getList(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false }
    });
  }

  async markRead(id: string, userId: string) {
    return prisma.notification.update({
      where: { id, userId },
      data: { isRead: true }
    });
  }

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }
}
