import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('generate-monthly')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Generate monthly invoices for all active leases' })
  generateMonthly(@CurrentUser() user: any, @Body() dto: GenerateInvoiceDto) {
    return this.invoicesService.generateMonthlyInvoices(dto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'List all invoices' })
  findAll(@CurrentUser() user: any, @Query() filters: any) {
    return this.invoicesService.listInvoices(user.userId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice details by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.invoicesService.getInvoiceById(id, user.userId);
  }
}
