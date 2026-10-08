import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
// import { prisma } from '@homia-os/database';
const prisma = { tenant: { findMany: async () => [], findUnique: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) } } as any;

@Injectable()
export class TenantsService {
  async create(ownerId: string, createTenantDto: CreateTenantDto) {
    return prisma.tenant.create({
      data: {
        ...createTenantDto,
        ownerId,
      },
    });
  }

  async findAll(ownerId: string) {
    return prisma.tenant.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, ownerId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { leases: true },
    });
    if (!tenant || tenant.ownerId !== ownerId) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async update(id: string, ownerId: string, updateTenantDto: UpdateTenantDto) {
    await this.findOne(id, ownerId);
    return prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
    });
  }

  async remove(id: string, ownerId: string) {
    await this.findOne(id, ownerId);
    return prisma.tenant.delete({
      where: { id },
    });
  }
}
