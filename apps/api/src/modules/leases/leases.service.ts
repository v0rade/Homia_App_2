import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateLeaseDto } from './dto/create-lease.dto';
// import { prisma } from '@homia-os/database';
const prisma = { lease: { findMany: async () => [], findUnique: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }, room: { findUnique: async () => ({ status: 'AVAILABLE', property: { ownerId: '' } }), update: async () => ({}) }, tenant: { findUnique: async () => ({ ownerId: '' }) } } as any;

@Injectable()
export class LeasesService {
  async create(ownerId: string, createLeaseDto: CreateLeaseDto) {
    const room = await prisma.room.findUnique({
      where: { id: createLeaseDto.roomId },
      include: { property: true },
    });
    if (!room || room.property.ownerId !== ownerId) {
      throw new NotFoundException('Room not found');
    }
    if (room.status === 'OCCUPIED') {
      throw new BadRequestException('Room is already occupied');
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: createLeaseDto.tenantId } });
    if (!tenant || tenant.ownerId !== ownerId) {
      throw new NotFoundException('Tenant not found');
    }

    const lease = await prisma.lease.create({
      data: {
        ...createLeaseDto,
        status: 'ACTIVE',
      },
    });

    await prisma.room.update({
      where: { id: createLeaseDto.roomId },
      data: { status: 'OCCUPIED' },
    });

    return lease;
  }

  async findAll(ownerId: string) {
    return prisma.lease.findMany({
      where: { room: { property: { ownerId } } },
      include: { tenant: true, room: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, ownerId: string) {
    const lease = await prisma.lease.findUnique({
      where: { id },
      include: { tenant: true, room: { include: { property: true } } },
    });
    if (!lease || lease.room.property.ownerId !== ownerId) {
      throw new NotFoundException(`Lease with ID ${id} not found`);
    }
    return lease;
  }
}
