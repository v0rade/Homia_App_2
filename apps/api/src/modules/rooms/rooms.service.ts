import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
// import { prisma } from '@homia-os/database';
const prisma = { room: { findMany: async () => [], findUnique: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }, property: { findUnique: async () => ({ ownerId: '' }) } } as any;

@Injectable()
export class RoomsService {
  async verifyPropertyAccess(propertyId: string, ownerId: string) {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.ownerId !== ownerId) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }
  }

  async create(ownerId: string, createRoomDto: CreateRoomDto) {
    await this.verifyPropertyAccess(createRoomDto.propertyId, ownerId);
    return prisma.room.create({
      data: createRoomDto,
    });
  }

  async findAll(propertyId: string, ownerId: string) {
    await this.verifyPropertyAccess(propertyId, ownerId);
    return prisma.room.findMany({
      where: { propertyId },
      orderBy: [{ floor: 'asc' }, { number: 'asc' }],
    });
  }

  async findOne(id: string, ownerId: string) {
    const room = await prisma.room.findUnique({
      where: { id },
      include: { property: true },
    });
    if (!room || room.property.ownerId !== ownerId) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async update(id: string, ownerId: string, updateRoomDto: UpdateRoomDto) {
    await this.findOne(id, ownerId);
    return prisma.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async remove(id: string, ownerId: string) {
    await this.findOne(id, ownerId);
    return prisma.room.delete({
      where: { id },
    });
  }
}
