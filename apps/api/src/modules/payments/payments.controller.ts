import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  create(@CurrentUser() user: any, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(user.userId, createPaymentDto);
  }

  @Get()
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'List all payments' })
  findAll(@CurrentUser() user: any) {
    return this.paymentsService.findAll(user.userId);
  }

  @Patch(':id/verify')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Verify a payment' })
  verify(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentsService.verifyPayment(id, user.userId);
  }

  @Patch(':id/reject')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Reject a payment' })
  reject(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: VerifyPaymentDto) {
    return this.paymentsService.rejectPayment(id, dto.notes || 'Rejected', user.userId);
  }
}
