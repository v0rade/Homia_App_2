import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccessCodesService } from './access-codes.service';
import { CreateAccessCodeDto } from './dto/create-access-code.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('access-codes')
@Controller('access-codes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AccessCodesController {
  constructor(private readonly accessCodesService: AccessCodesService) {}

  @Post('generate')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Generate a new access code' })
  generate(@CurrentUser() user: any, @Body() dto: CreateAccessCodeDto) {
    return this.accessCodesService.generateCode(user.userId, dto);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate access code' })
  validate(@Body('code') code: string, @Body('roomId') roomId: string) {
    return this.accessCodesService.validateCode(code, roomId);
  }

  @Delete(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Revoke access code' })
  revoke(@Param('id') id: string, @CurrentUser() user: any) {
    return this.accessCodesService.revokeCode(id, user.userId);
  }

  @Get('logs/:roomId')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Get access logs for a room' })
  getLogs(@Param('roomId') roomId: string, @CurrentUser() user: any) {
    return this.accessCodesService.getLogs(roomId, user.userId);
  }
}
