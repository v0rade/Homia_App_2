import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAccessCodeDto } from './dto/create-access-code.dto';
// import { prisma } from '@homia-os/database';
const prisma = { accessCode: { create: async () => ({}), findFirst: async () => null, delete: async () => ({}), findMany: async () => [] }, room: { findUnique: async () => ({ property: { ownerId: '' } }) } } as any;

@Injectable()
export class AccessCodesService {
  async generateCode(ownerId: string, dto: CreateAccessCodeDto) {
    const room = await prisma.room.findUnique({
      where: { id: dto.roomId },
      include: { property: true }
    });
    if (!room || room.property.ownerId !== ownerId) {
      throw new NotFoundException('Room not found');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    return prisma.accessCode.create({
      data: {
        code,
        roomId: dto.roomId,
        expiresAt: new Date(dto.expiresAt),
        isActive: true
      }
    });
  }

  async validateCode(code: string, roomId: string) {
    const accessCode = await prisma.accessCode.findFirst({
      where: { code, roomId, isActive: true }
    });
    
    if (!accessCode) {
      throw new BadRequestException('Invalid access code');
    }
    
    if (new Date() > new Date(accessCode.expiresAt)) {
      throw new BadRequestException('Access code expired');
    }
    
    return { valid: true };
  }

  async revokeCode(id: string, ownerId: string) {
    return prisma.accessCode.delete({
      where: { id }
    });
  }

  async getLogs(roomId: string, ownerId: string) {
    return prisma.accessCode.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
