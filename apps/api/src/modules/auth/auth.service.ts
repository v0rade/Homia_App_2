import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { prisma } from '@homia-os/database';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '@homia-os/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
    if (!user || !user.isActive) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) return null;
    const { password, refreshToken, ...result } = user;
    return result;
  }

  private generateTokens(payload: { email: string; sub: string; role: UserRole }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn', '15m'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '7d'),
    });
    return { accessToken, refreshToken };
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const { accessToken, refreshToken } = this.generateTokens(payload);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });
    return { accessToken, refreshToken, user };
  }

  async register(registerDto: RegisterDto) {
    const existing = await prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = await prisma.user.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        phone: registerDto.phone,
        password: hashedPassword,
        role: registerDto.role ?? UserRole.TENANT,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    return user;
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || !user.refreshToken || !user.isActive) {
        throw new UnauthorizedException('Access Denied');
      }
      const matches = await bcrypt.compare(token, user.refreshToken);
      if (!matches) throw new UnauthorizedException('Access Denied');

      // Rotate refresh token
      const newPayload = { email: user.email, sub: user.id, role: user.role };
      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(newPayload);
      const hashed = await bcrypt.hash(newRefreshToken, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashed },
      });
      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        tenantProfile: {
          select: {
            id: true,
            propertyId: true,
            fullName: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
  }
}
