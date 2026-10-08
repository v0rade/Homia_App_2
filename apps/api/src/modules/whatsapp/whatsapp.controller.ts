import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('whatsapp')
@Controller('whatsapp')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('generate-reminder')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Generate WhatsApp reminder message and link' })
  generateReminder(@CurrentUser() user: any, @Body('invoiceId') invoiceId: string) {
    return this.whatsappService.generateReminderMessage(invoiceId, user.userId);
  }
}
