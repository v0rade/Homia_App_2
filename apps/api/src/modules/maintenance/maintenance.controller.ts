import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('maintenance')
@Controller('maintenance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new maintenance ticket' })
  create(@CurrentUser() user: any, @Body() createTicketDto: CreateTicketDto) {
    return this.maintenanceService.create(user.userId, user.userId, createTicketDto); // Mocking tenantId as user.userId for simplicity
  }

  @Get()
  @ApiOperation({ summary: 'Get all maintenance tickets' })
  findAll(@CurrentUser() user: any) {
    return this.maintenanceService.findAll(user.userId);
  }

  @Get('kanban')
  @ApiOperation({ summary: 'Get tickets for kanban board' })
  getKanban(@CurrentUser() user: any) {
    return this.maintenanceService.getKanbanBoard(user.userId);
  }

  @Get('analytics')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Get maintenance analytics' })
  getAnalytics(@CurrentUser() user: any) {
    return this.maintenanceService.getAnalytics(user.userId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER', 'STAFF')
  @ApiOperation({ summary: 'Update a maintenance ticket' })
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() updateTicketDto: UpdateTicketDto) {
    return this.maintenanceService.update(id, user.userId, updateTicketDto);
  }
}
