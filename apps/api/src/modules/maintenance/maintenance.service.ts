import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
// import { prisma } from '@homia-os/database';
const prisma = { maintenanceTicket: { create: async () => ({}), findMany: async () => [], findUnique: async () => null, update: async () => ({}) }, room: { findUnique: async () => ({ property: { ownerId: '' } }) } } as any;

@Injectable()
export class MaintenanceService {
  async create(ownerId: string, tenantId: string, createTicketDto: CreateTicketDto) {
    const room = await prisma.room.findUnique({
      where: { id: createTicketDto.roomId },
      include: { property: true }
    });
    
    if (!room || room.property.ownerId !== ownerId) {
      throw new NotFoundException('Room not found');
    }

    return prisma.maintenanceTicket.create({
      data: {
        ...createTicketDto,
        tenantId,
        status: 'OPEN',
      }
    });
  }

  async findAll(ownerId: string) {
    return prisma.maintenanceTicket.findMany({
      where: { room: { property: { ownerId } } },
      include: { room: true, tenant: true, assignee: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string, ownerId: string) {
    const ticket = await prisma.maintenanceTicket.findUnique({
      where: { id },
      include: { room: { include: { property: true } } }
    });
    
    if (!ticket || ticket.room.property.ownerId !== ownerId) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async update(id: string, ownerId: string, updateTicketDto: UpdateTicketDto) {
    await this.findOne(id, ownerId);
    return prisma.maintenanceTicket.update({
      where: { id },
      data: updateTicketDto
    });
  }

  async getKanbanBoard(ownerId: string) {
    const tickets = await this.findAll(ownerId);
    const board = {
      OPEN: tickets.filter((t: any) => t.status === 'OPEN'),
      IN_PROGRESS: tickets.filter((t: any) => t.status === 'IN_PROGRESS'),
      RESOLVED: tickets.filter((t: any) => t.status === 'RESOLVED'),
      CLOSED: tickets.filter((t: any) => t.status === 'CLOSED'),
    };
    return board;
  }

  calculateSlaStatus(ticket: any) {
    const slaMap: Record<string, number> = { LOW: 72, MEDIUM: 48, HIGH: 24, URGENT: 4 };
    const slaHours = slaMap[ticket.priority] || 48;
    
    const created = new Date(ticket.createdAt).getTime();
    const now = new Date().getTime();
    const hoursOpen = (now - created) / (1000 * 60 * 60);
    
    return {
      hoursOpen,
      slaHours,
      isBreached: hoursOpen > slaHours,
      isApproaching: hoursOpen > (slaHours * 0.8) && hoursOpen <= slaHours
    };
  }

  async getAnalytics(ownerId: string) {
    const tickets = await this.findAll(ownerId);
    return {
      total: tickets.length,
      open: tickets.filter((t: any) => t.status === 'OPEN').length,
    };
  }
}
