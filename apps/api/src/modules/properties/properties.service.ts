import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyQueryDto } from './dto/property-query.dto';
import { parsePagination, buildPaginationMeta } from '../../common/utils/pagination.util';
// import { prisma } from '@homia-os/database';
const prisma = { property: { findMany: async () => [], count: async () => 0, findUnique: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }, room: { findMany: async () => [] } } as any;

@Injectable()
export class PropertiesService {
  async create(ownerId: string, createPropertyDto: CreatePropertyDto) {
    return prisma.property.create({
      data: {
        ...createPropertyDto,
        ownerId,
      },
    });
  }

  async findAll(ownerId: string, query: PropertyQueryDto) {
    const { page, limit, skip } = parsePagination(query);
    const where: any = { ownerId };
    
    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.property.count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findOne(id: string, ownerId: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { rooms: true },
    });

    if (!property || property.ownerId !== ownerId) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(id: string, ownerId: string, updatePropertyDto: UpdatePropertyDto) {
    await this.findOne(id, ownerId); // Verify ownership
    return prisma.property.update({
      where: { id },
      data: updatePropertyDto,
    });
  }

  async remove(id: string, ownerId: string) {
    await this.findOne(id, ownerId); // Verify ownership
    return prisma.property.delete({
      where: { id },
    });
  }

  async getRooms(id: string, ownerId: string) {
    await this.findOne(id, ownerId);
    return prisma.room.findMany({
      where: { propertyId: id },
    });
  }

  async getStats(id: string, ownerId: string) {
    await this.findOne(id, ownerId);
    const rooms = await prisma.room.findMany({ where: { propertyId: id } });
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r: any) => r.status === 'OCCUPIED').length;
    return {
      totalRooms,
      occupiedRooms,
      occupancyRate: totalRooms ? (occupiedRooms / totalRooms) * 100 : 0,
    };
  }
}
